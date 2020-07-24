import { Config } from './config';
import { ConnectionCode } from './connectionCode';
import { ConnectionView } from './connectionView';
import { Model } from './model';
import { Network } from './network';
import { Node } from './node';
import { Synapse } from './synapse';


enum Rule {
    AllToAll = "all_to_all",
    FixedIndegree = "fixed_indegree",
    FixedOutdegree = "fixed_outdegree",
    FixedTotalNumber = "fixed_total_number",
    OneToOne = "one_to_one",
    PairwiseBernoulli = "pairwise_bernoulli"
}


export class Connection {
  public network: Network;                     // parent
  public config: Config;                       // config
  public code: ConnectionCode;
  public view: ConnectionView;
  private _idx: number;                         // generative

  // arguments for nest.Connect
  private _source: number;                      // Node index
  private _target: number;                      // Node index
  private _rule: string;

  params: any[];
  synapse: Synapse;

  src_idx?: number[];
  tgt_idx?: number[];
  projections?: any;


  constructor(network: any, connection: any) {
    this.network = network;
    this.idx = network.connections.length;
    this.config = new Config(this);
    this.code = new ConnectionCode(this);
    this.view = new ConnectionView(this);

    this._source = connection.source;
    this._target = connection.target;
    this.rule = connection.rule || Rule.AllToAll;
    this.params = connection.params || [];
    this.synapse = new Synapse(this, connection.synapse);

  }

  get idx(): number {
    return this._idx;
  }

  set idx(value: number) {
    this._idx = value;
  }

  get source(): Node {
    return this.network.nodes[this._source];
  }

  set source(node: Node) {
    this._source = node.idx;
  }

  get target(): Node {
    return this.network.nodes[this._target];
  }

  set target(node: Node) {
    this._target = node.idx;
  }

  get model(): Model {
    return this.synapse.model;
  }

  get rule(): string {
    return this._rule;
  }

  set rule(value: string) {
    this._rule = value;
    this.params = this.view.getRuleParams();
  }

  select(): void {
    this.network.view.selectedConnection = this;
  }

  clean(): void {
    this.idx = this.network.connections.indexOf(this);
  }

  isBothSpatial(): boolean {
    return this.source.view.isSpatial() && this.target.view.isSpatial();
  }

  hasProjections(): boolean {
    return false;
  }

  reset(): void {
    if (this.hasProjections()) {
      this.projections.weights = 1;
      this.projections.delays = 1;
      this.projections.kernel = 1;
      this.projections.connection_type = 'convergent';
      this.projections.number_of_connections = undefined;
      this.projections.mask = undefined;
    } else {
      this.src_idx = undefined;
      this.tgt_idx = undefined;
      this.rule = Rule.AllToAll;
      this.synapse.modelId = 'static_synapse';
    }
  }

  hasSourceIndices(): boolean {
    return this.src_idx !== undefined;
  }

  hasTargetIndices(): boolean {
    return this.tgt_idx !== undefined;
  }

  delete(): void {
    this.network.deleteConnection(this);
  }

  serialize(to: string): any {
    const connection: any = {
      source: this._source,
      target: this._target,
    }

    if (to === 'simulator') {
      // Collect specifications of the connection
      connection['conn_spec'] = {
        rule: this.rule,
      };
      this.params.forEach(param => connection.conn_spec[param.id] = param.value);
      connection['syn_spec'] = this.synapse.serialize(to);     // Collect specifications of the synapse
    } else {
      connection['rule'] = this.rule;
      connection['params'] = this.params;
      connection['synapse'] = this.synapse.serialize(to);
    }

    return connection;
  }

}
