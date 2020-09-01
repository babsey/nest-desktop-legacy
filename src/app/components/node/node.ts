import { Activity } from '../activity/activity';
import { Config } from '../config';
import { Connection } from '../connection/connection';
import { Model } from '../model/model';
import { Network } from '../network/network';
import { NodeCode } from './nodeCode';
import { NodeSpatial } from './nodeSpatial';
import { NodeView } from './nodeView';
import { Parameter } from '../parameter';


export class Node extends Config {
  network: Network;                 // parent
  idx: number;                      // generative
  code: NodeCode;                   // code service for node
  view: NodeView;

  // Arguments for nest.Create
  private _modelId: string;
  size: number;
  params: Parameter[] = [];
  spatial: NodeSpatial;
  positions: number[][] = [];

  // Only recorder node
  recordFrom: string[];             // only for multimeter
  activity: Activity;

  constructor(network: any, node: any) {
    super('Node');
    this.network = network;
    this.idx = network.nodes.length;
    this.code = new NodeCode(this);
    this.view = new NodeView(this, node.view);

    this._modelId = node.model;
    if (this.model.isRecorder()) {
      this.activity = new Activity(this);
    }

    this.size = node.size || 1;
    this.initParameters(node);
    this.initSpatial(node.spatial);
  }

  get n(): number {
    return this.size;
  }

  get model(): Model {
    return this.network.project.app.getModel(this.modelId);
  }

  set model(model: Model) {
    this.modelId = model.id;
  }

  get models(): Model[] {
    const elementType: string = this.model.elementType;
    return this.network.project.app.filterModels(elementType);
  }

  get modelId(): string {
    return this._modelId;
  }

  set modelId(value: string) {
    this._modelId = value;
    this.size = 1;
    this.spatial = new NodeSpatial(this);
    this.initParameters();
    if (this.model.elementType === 'recorder') {
      this.activity = undefined;
    }
    this.network.clean();
    this.network.commit();
  }

  get recordables(): string[] {
    if (this.model.existing !== 'multimeter') return []
    const targets: Node[] = this.targets;
    if (targets.length === 0) return []
    const recordables = targets.map((target: Node) => target.model.recordables);
    if (recordables.length === 0) return [];
    const recordablesFlat: string[] = [].concat(...recordables);
    const recordablesSet: any[] = [...new Set(recordablesFlat)];
    recordablesSet.sort((a: number, b: number) => a - b);
    return recordablesSet;
  }

  get sources(): Node[] {
    const nodes: Node[] = this.network.connections
      .filter((connection: Connection) => connection.target.idx === this.idx)
      .map((connection: Connection) => connection.source);
    return nodes;
  }

  get targets(): Node[] {
    const nodes: Node[] = this.network.connections
      .filter((connection: Connection) => connection.source.idx === this.idx)
      .map((connection: Connection) => connection.target);
    return nodes;
  }

  get nodes(): Node[] {
    if (this.model.existing === 'spike_detector') return this.sources;
    if (['multimeter', 'voltmeter'].includes(this.model.existing)) return this.targets;
    return [];
  }

  initParameters(node: any = null): void {
    // Update parameters from model or node
    this.params = [];
    if (this.model && node && node.hasOwnProperty('params')) {
      this.model.params.forEach((modelParam: Parameter) => {
        const nodeParam = node.params.find((p: any) => p.id === modelParam.id);
        this.addParameter(nodeParam || modelParam);
      });
    } else if (this.model) {
      this.model.params.forEach((param: Parameter) => this.addParameter(param));
    } else if (node.hasOwnProperty('params')) {
      node.params.forEach((param: Parameter) => this.addParameter(param));
    }
    if (this.model.existing === 'multimeter') {
      this.recordFrom = (node !== null) ? node.recordFrom || ['V_m'] : ['V_m'];
    }
  }

  addParameter(param: any): void {
    this.params.push(new Parameter(this, param));
  }

  hasParameter(paramId: string): boolean {
    return this.params.find((param: Parameter) => param.id === paramId) !== undefined;
  }

  getParameter(paramId: string): any {
    if (this.hasParameter(paramId)) {
      return this.params.find((param: Parameter) => param.id === paramId).value;
    }
  }

  resetParameters(): void {
    this.params.forEach((param: Parameter) => param.value = param.options.value);
  }

  setWeights(term: string): void {
    const connections: Connection[] = this.network.connections
      .filter((connection: Connection) => connection.source.idx === this.idx && connection.target.model.elementType !== 'recorder')
    connections.forEach((connection: Connection) => {
      const value: number = Math.abs(connection.synapse.weight);
      connection.synapse.weight = (term === 'inhibitory' ? -1 : 1) * value;
    })
  }

  initSpatial(spatial: any = {}) {
    this.spatial = new NodeSpatial(this, spatial);
  }

  clean(): void {
    this.idx = this.network.nodes.indexOf(this);
    this.collectRecordFromTargets();
    this.view.clean();
  }

  collectRecordFromTargets(): void {
    if (this.model.existing !== 'multimeter') return
    const recordables = this.recordables;
    this.recordFrom = (recordables.length > 0) ? this.recordFrom.filter((rec: string) => recordables.includes(rec)) : [];
  }

  clone(): Node {
    return new Node(this.network, this);
  }

  delete(): void {
    this.network.deleteNode(this);
  }

  copy(item: any): any {
    return JSON.parse(JSON.stringify(item));
  }

  toJSON(target: string = 'db'): any {
    const node: any = {
      model: this.modelId,
    };
    if (target === 'simulator') {
      node['n'] = this.size;
      node['element_type'] = this.model.elementType;
      node['params'] = {};
      this.params
        .filter((param: Parameter) => param.visible)
        .forEach((param: Parameter) => node.params[param.id] = param.value);
      if (this.model.existing === 'multimeter' && this.recordFrom.length > 0) {
        node.params['record_from'] = this.recordFrom;
      }
    } else {
      node['size'] = this.size;
      node['view'] = this.view.toJSON();
      node['params'] = this.params.map((param: Parameter) => param.toJSON());
      if (this.model.existing === 'multimeter') {
        node['recordFrom'] = this.recordFrom;
      }
    }
    if (this.spatial.hasPositions()) {
      node['spatial'] = this.spatial.toJSON(target);
    }
    return node;
  }

}
