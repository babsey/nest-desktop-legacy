import { Activity } from './activity';
import { Config } from './config';
import { Model } from './model';
import { Network } from './network';
import { NodeCode } from './nodeCode';
import { NodeView } from './nodeView';
import { Parameter } from './parameter';
import { Spatial } from './spatial';


export class Node {
  network: Network;                 // parent
  idx: number;                      // generative
  config: Config;
  code: NodeCode;
  view: NodeView;

  // Arguments for nest.Create
  _modelId: string;
  size: number;
  params: Parameter[] = [];
  spatial: Spatial;
  positions: number[][] = [];

  // Only recorder
  events: any = {};
  activity: Activity;

  constructor(network: any, node: any) {
    this.network = network;
    this.idx = network.nodes.length;
    this.config = new Config(this);
    this.code = new NodeCode(this);
    this.view = new NodeView(this, node.view);

    this._modelId = node.model;
    this.size = node.size || 1;
    this.initParameters(node);
    this.spatial = new Spatial(this, node.spatial);
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
    this.spatial = null;
    this.initParameters();
    this.network.clean();
    if (this.model.elementType === 'recorder') {
      this.events = {};
      this.activity = undefined;
    }
  }

  get recordables(): string[] {
    if (this.model.existing !== 'multimeter') return []
    const targets: Node[] = this.targets || [];
    if (targets.length === 0) return []
    const recordables = targets.map(target => target.model.recordables);
    if (recordables.length === 0) return [];
    const recordablesFlat: string[] = [].concat(recordables);
    const recordablesSet: any[] = [...new Set(recordablesFlat)];
    recordablesSet.sort((a: number, b: number) => a - b);
    return recordablesSet;
  }

  get senders(): number[] {
    const senders: any[] = [...new Set(this.events['senders'])];
    if (senders.length > 0) {
      senders.sort((a: number, b: number) => a - b);
    }
    return senders;
  }

  get sources(): Node[] {
    const nodes: Node[] = this.network.connections
      .filter(connection => connection.target.idx === this.idx)
      .map(connection => connection.source);
    return nodes;
  }

  get targets(): Node[] {
    const nodes: Node[] = this.network.connections
      .filter(connection => connection.source.idx === this.idx)
      .map(connection => connection.target);
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
      this.model.params.forEach(modelParam => {
        const nodeParam = node.params.find(p => p.id === modelParam.id);
        this.addParameter(nodeParam || modelParam);
      });
    } else if (this.model) {
      this.model.params.forEach(param => this.addParameter(param));
    } else if (node.hasOwnProperty('params')) {
      node.params.forEach(param => this.addParameter(param));
    }
  }

  addParameter(param: any): void {
    this.params.push(new Parameter(this, param));
  }

  hasParameter(paramId: string): boolean {
    return this.params.find(param => param.id === paramId) !== undefined;
  }

  getParameter(paramId: string): any {
    return this.hasParameter(paramId) ? this.params.find(param => param.id === paramId).value : null;
  }

  resetParameters(): void {
    this.params.forEach(param => param.value = param.options.value);
  }

  clean(): void {
    this.idx = this.network.nodes.indexOf(this);
    this.collectRecordFromTargets();
    this.view.clean();
  }

  collectRecordFromTargets(): void {
    if (this.model.existing !== 'multimeter') return
    const param: Parameter = this.params.find(p => p.id === 'record_from');
    const recordables = this.recordables;
    param.value = (recordables.length > 0) ? param.value.filter(rec => recordables.includes(rec)) : [];
  }

  clone(): Node {
    return new Node(this.network, this);
  }

  delete(): void {
    this.network.deleteNode(this);
  }

  updateActivity(activity: any): void {
    console.log('Update activity in recorder')
    this.events = this.copy(activity['events'][0]);
    if (this.view.hasEvents()) {
      if (this.activity === undefined) {
        this.activity = new Activity(this, activity);
      } else {
        this.activity.update(activity);
      }
    }
  }

  serialize(to: string): any {
    const node: any = {
      model: this.modelId,
    };
    if (to === 'simulator') {
      node['n'] = this.size;
      node['element_type'] = this.model.elementType;
      node['params'] = {};
      this.params
        .filter(p => p.visible)
        .forEach(p => node.params[p.id] = p.value);
      // if (this.spatial) {
      //   kwargs['positions'] = this.spatial.positions;
      // }
    } else {
      node['size'] = this.size;
      node['view'] = this.view.serialize();
      node['params'] = this.params.map(param => param.serialize());
    }
    return node;
  }

  // download raw data of the simulator
  downloadEvents(): void {
    this.network.project.app.download(this.events, 'events');
  }

  copy(item: any): any {
    return JSON.parse(JSON.stringify(item));
  }

}
