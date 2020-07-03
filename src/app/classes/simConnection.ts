import { Data } from './data';


export class SimConnection {
  source: number;
  target: number;
  src_idx?: number[];
  tgt_idx?: number[];
  conn_spec?: any;
  syn_spec?: any;
  projections?: any;

  constructor(
    data: any = {},
  ) {
    this.source = data.source;
    this.target = data.target;
    this.src_idx = data.src_idx || [];
    this.tgt_idx = data.tgt_idx || [];
    this.conn_spec = data.conn_spec || { rule: 'all_to_all' };
    this.syn_spec = data.syn_spec || {};
    this.projections = data.projections || {};
  }

  clean(data: Data): void {
    this.cleanSpecs()
    this.cleanConnection(data)
    this.cleanOrderConnectionRecorder(data)
  }

  cleanSpecs(): void {
    if (this.conn_spec == undefined || this.conn_spec == {}) {
      this.conn_spec = { rule: 'all_to_all' };
    } else if (typeof this.conn_spec == 'string') {
      this.conn_spec = { rule: this.conn_spec }
    }

    if (this.syn_spec == undefined) {
      this.syn_spec = { model: 'static_synapse', weight: 1, delay: 1 };
    } else if (typeof this.syn_spec == 'string') {
      this.syn_spec = { model: this.syn_spec, weight: 1, delay: 1 };
    } else if (typeof this.syn_spec == 'object') {
      this.syn_spec['model'] = this.syn_spec['model'] || 'static_synapse';
      this.syn_spec['weight'] = this.syn_spec['weight'] != undefined ? this.syn_spec['weight'] : 1;
      this.syn_spec['delay'] = this.syn_spec['delay'] || 1;
    }
  }

  cleanConnection(data: Data): void {
    if (this.isBothSpatial(data) && !this.hasProjections()) {
      var projections = {
        weights: this.syn_spec.hasOwnProperty('weight') ? this.syn_spec.weight : 1,
        delays: this.syn_spec.hasOwnProperty('delay') ? this.syn_spec.delay : 1,
      };
      switch (this.conn_spec.rule) {
        case 'fixed_indegree':
          projections['connection_type'] = 'convergent';
          projections['number_of_connections'] = this.conn_spec.indegree || 1;
          break;
        case 'fixed_outdegree':
          projections['connection_type'] = 'divergent';
          projections['number_of_connections'] = this.conn_spec.outdegree || 1;
          break;
        default:
          projections['connection_type'] = 'convergent';
          projections['kernel'] = 1;
          break;
      }
      this.projections = projections;
    }

    if (!this.isBothSpatial(data) && this.hasProjections()) {
      console.log('boo')
      if (typeof this.projections.weights == 'number') {
        this.syn_spec.weight = this.projections.weights;
      }
      if (typeof this.projections.delays == 'number') {
        this.syn_spec.delay = this.projections.delays;
      }
      this.projections = {};
    }

  }

  cleanOrderConnectionRecorder(data: Data): boolean {
    if (this.source == this.target) return false
    var source = data.simulation.collections[this.source];
    var target = data.simulation.collections[this.target];
    var sourceModel = data.simulation.getModel(source);
    var targetModel = data.simulation.getModel(target);
    if (sourceModel == 'spike_detector' || ['voltmeter', 'multimeter'].includes(targetModel)) {
      this.target = [this.source, this.source = this.target][0];
      return true;
    }
  }

  // Boolean functions

  hasProjections(): boolean {
    return Object.keys(this.projections).length > 0;
  }

  hasSourceIndices(): boolean {
    return this.src_idx.length > 0;
  }

  hasTargetIndices(): boolean {
    return this.tgt_idx.length > 0;
  }

  isBothSpatial(data: Data): boolean {
    var source = data.simulation.collections[this.source];
    var target = data.simulation.collections[this.target];
    return (source.isSpatial() && target.isSpatial())
  }

}
