import { Config } from '../config';
import { ConnectionCode } from './connectionCode';
import { ConnectionMask } from './connectionMask';
import { ConnectionProjections } from './connectionProjections';
import { ConnectionView } from './connectionView';
import { Model } from '../model/model';
import { Network } from '../network/network';
import { Node } from '../node/node';
import { Parameter } from '../parameter';
import { Synapse } from './synapse';


enum Rule {
  AllToAll = 'all_to_all',
  FixedIndegree = 'fixed_indegree',
  FixedOutdegree = 'fixed_outdegree',
  FixedTotalNumber = 'fixed_total_number',
  OneToOne = 'one_to_one',
  PairwiseBernoulli = 'pairwise_bernoulli'
}


export class Connection extends Config {
  private _network: Network;                     // parent
  private _code: ConnectionCode;
  private _view: ConnectionView;
  private _idx: number;                         // generative
  private _name = 'Connection';

  // arguments for nest.Connect
  private _source: number;                      // Node index
  private _target: number;                      // Node index
  private _rule: string;

  private _params: any[];
  private _projections: ConnectionProjections;           // only for NEST 2, will be deprecated in NEST 3;
  private _mask: ConnectionMask;
  private _synapse: Synapse;

  srcIdx?: number[];
  tgtIdx?: number[];


  constructor(network: any, connection: any) {
    super('Connection');
    this._network = network;
    this._idx = network.connections.length;
    this._code = new ConnectionCode(this);
    this._view = new ConnectionView(this);

    this._source = connection.source;
    this._target = connection.target;

    this._rule = connection.rule || Rule.AllToAll;
    this._params = connection.params || [];

    this._mask = new ConnectionMask(this, connection.mask);
    this._projections = new ConnectionProjections(this, connection.projections);
    this._synapse = new Synapse(this, connection.synapse);
  }

  get code(): ConnectionCode {
    return this._code;
  }

  get idx(): number {
    return this._idx;
  }

  get mask(): ConnectionMask {
    return this._mask;
  }

  get model(): Model {
    return this._synapse.model;
  }

  get name(): string {
    return this._name;
  }

  get network(): Network {
    return this._network;
  }

  get params(): any[] {
    return this._params;
  }

  get projections(): ConnectionProjections {
    return this._projections;
  }

  get rule(): string {
    return this._rule;
  }

  set rule(value: string) {
    this._rule = value;
    this._params = this.view.getRuleParams();
    this.connectionChanges();
  }

  get source(): Node {
    return this._network.nodes[this._source];
  }

  set source(node: Node) {
    this._source = node.idx;
  }

  get synapse(): Synapse {
    return this._synapse;
  }

  get target(): Node {
    return this._network.nodes[this._target];
  }

  set target(node: Node) {
    this._target = node.idx;
  }

  get view(): ConnectionView {
    return this._view;
  }

  connectionChanges(): void {
    this._network.networkChanges();
  }

  reverse(): void {
    [this.source, this.target] = [this.target, this.source];
    this.connectionChanges();
  }

  select(): void {
    this._network.view.selectedConnection = this;
  }

  clean(): void {
    this._idx = this._network.connections.indexOf(this);
  }

  isBothSpatial(): boolean {
    return this.source.spatial.hasPositions() && this.target.spatial.hasPositions();
  }

  hasProjections(): boolean {
    return false;
  }

  reset(): void {
    this.srcIdx = undefined;
    this.tgtIdx = undefined;
    this.rule = Rule.AllToAll;
    this.synapse.modelId = 'static_synapse';
    this._projections.reset();
    this._mask.unmask();
    this.connectionChanges();
  }

  hasSourceIndices(): boolean {
    return this.srcIdx !== undefined;
  }

  hasTargetIndices(): boolean {
    return this.tgtIdx !== undefined;
  }

  delete(): void {
    this._network.deleteConnection(this);
  }

  toJSON(target: string = 'db'): any {
    const connection: any = {
      source: this._source,
      target: this._target,
    };

    if (target === 'simulator') {
      // Collect specifications of the connection
      connection.conn_spec = {
        rule: this._rule,
      };
      this._params.forEach((param: Parameter) => connection.conn_spec[param.id] = param.value);
      if (this._mask.hasMask()) {
        connection.conn_spec.mask = this._mask.toJSON(target);
      }
      connection.syn_spec = this._synapse.toJSON(target);     // Collect specifications of the synapse
    } else {
      connection.rule = this._rule;
      connection.params = this._params;
      connection.mask = this._mask.toJSON(target);
      connection.synapse = this._synapse.toJSON(target);
    }

    if (this.isBothSpatial()) {
      connection.projections = this._projections.toJSON(target);
    }

    return connection;
  }

}
