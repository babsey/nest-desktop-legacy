import { Injectable } from '@angular/core';

import { FormatService } from '../../services/format/format.service';

import { Data } from '../../classes/data';
import { AppNode } from '../../classes/appNode';
import { SimNode } from '../../classes/simNode';
import { SimModel } from '../../classes/simModel';
import { SimConnection } from '../../classes/simConnection';


@Injectable({
  providedIn: 'root'
})
export class SimulationCodeService {
  private data: Data;
  private modelLabel: any = {
    'stimulator': 'stim',
    'neuron': 'neuron',
    'recorder': 'rec',
  };

  constructor(
    private _formatService: FormatService,
  ) { }

  _(n: number = 1): string {
    return '\n' + '  '.repeat(n)
  }

  end(): string {
    return '\n';
  }

  generate(data: Data, sections: string[] = ['kernel', 'models', 'nodes', 'connections', 'events']): string {
    this.data = data;
    let script: string = '';
    script += this.importModules();
    script += 'nest.ResetKernel()\n';

    if (sections.includes('kernel') && data.simulation.hasOwnProperty('kernel')) {
      script += '\n\n';
      script += '# Simulation kernel\n';
      script += this.randomSeed();
      script += this.setKernelStatus();
    }

    if (sections.includes('models')) {
      script += '\n\n';
      script += '# Copy models\n';
      data.app.nodes.map(node => script += this.copyModel(node.idx))
    }

    if (sections.includes('nodes')) {
      script += '\n\n';
      script += '# Create nodes\n';
      data.app.nodes.map(node => script += this.createNode(node.idx))
    }

    if (sections.includes('connections')) {
      script += '\n\n';
      script += '# Connect nodes\n';
      data.app.links.map(link => script += this.connectNodes(link.idx))
    }

    script += '\n\n';
    script += '# Run simulation\n';
    script += this.simulate();

    if (sections.includes('events')) {
      script += '\n\n';
      script += '# Collect events\n';
      script += this.getData();
    }
    return script;
  }

  nodeVariable(node: SimNode): string {
    return 'node' + node.label.toUpperCase();
  }

  importModules(): string {
    let script: string = '';
    script += 'import nest\n';
    script += 'import numpy as np\n';
    return script + '\n';
  }

  randomSeed(): string {
    let script: string = '';
    script += 'np.random.seed(' + (this.data.simulation.random_seed) + ')\n';
    return script;
  }

  setKernelStatus(): string {
    let status = this.data.simulation.kernel;
    if (status == undefined) return ''
    const local_num_threads = parseInt(status.hasOwnProperty('local_num_threads') ? status['local_num_threads'] : 1);
    let script: string = '';
    script += 'nest.SetKernelStatus({';
    script += this._() + '"local_num_threads": ' + local_num_threads + ',',
      script += this._() + '"resolution": ' + this._formatService.format(status['resolution'] || 1) + ',';
    script += this._() + '"rng_seeds": ' + 'np.random.randint(0, 1000, ' + local_num_threads + ').tolist()';
    script += this.end() + '})\n';
    return script;
  }

  isRandom(value: any): boolean {
    return value.constructor === Object && value.hasOwnProperty('parametertype');
  }

  XOR(a: boolean, b: boolean): boolean {
    return (a || b) && !(a && b);
  }

  params(params: any): string {
    let script: string = '';
    if (params === undefined) return script;
    if (Object.entries(params).length === 0 && params.constructor === Object) return script;
    const paramsList: string[] = [];
    Object.keys(params).map(param => {
      if (param == 'record_from') {
        const record_from: string[] = params[param].map(r => '"' + r + '"');
        paramsList.push(this._() + '"' + param + '": [' + record_from.join(',') + ']');
      } else if (this.isRandom(params[param])) {
        if (params[param].parametertype == 'constant') {
          paramsList.push(this._() + '"' + param + '": ' + this._formatService.format(params[param].specs.value));
        } else {
          const specs = params[param].specs;
          if (specs === undefined) return
          if (Object.entries(specs).length === 0) return
          const values = Object.keys(specs)
            .filter(spec => !this.XOR(params[param].parametertype == 'uniform', ['min', 'max'].includes(spec)))
            .map(spec => this._formatService.format(specs[spec]))
          let random: string = 'nest.random.' + params[param].parametertype + '(' + values.join(', ') + ')';
          paramsList.push(this._() + '"' + param + '": ' + random)
        }
      } else {
        paramsList.push(this._() + '"' + param + '": ' + this._formatService.format(params[param]));
      }
    })
    if (paramsList.length > 0) {
      script += ', {';
      script += paramsList.join(',')
      script += this.end() + '}';
    }
    return script;
  }

  filterParams(display: string[], params: any): any {
    let filteredParams: any = {};
    if (display) {
      display.map(key => {
        filteredParams[key] = params[key];
      });
      if (params.hasOwnProperty('record_from')) {
        filteredParams['record_from'] = params.record_from;
      }
    }
    return filteredParams;
  }

  copyModel(idx: number): string {
    let simNode = this.data.simulation.collections[idx];
    if (!this.data.simulation.models.hasOwnProperty(simNode.model)) return ''
    let simModel = this.data.simulation.models[simNode.model];
    let script: string = '';
    script += 'nest.CopyModel("' + simModel.existing + '", "' + simNode.model + '"';
    if (simModel.hasOwnProperty('params')) {
      script += this.params(simModel.params);
    }
    script += ')';
    return script + '\n';
  }

  createNode(idx: number): string {
    let appNode = this.data.app.nodes[idx];
    let simNode = this.data.simulation.collections[idx];
    let script: string = '';
    script += this.nodeVariable(simNode) + ' = nest.Create("' + simNode.model + '", ' + simNode.n;
    if (simNode.hasOwnProperty('params')) {
      script += this.params(this.filterParams(appNode.display, simNode.params));
    }
    script += ')';
    return script + '\n';
  }

  connectNodes(idx: number): string {
    let simLink = this.data.simulation.connectomes[idx];
    let source = this.data.simulation.collections[simLink.source];
    let target = this.data.simulation.collections[simLink.target];
    if (['multimeter', 'voltmeter'].includes(target.model)) {
      target = [source, source = target][0];
    }
    let script: string = '';
    script += 'nest.Connect(' + this.nodeVariable(source) + ', ' + this.nodeVariable(target);
    if (simLink.conn_spec) {
      if (simLink.conn_spec.rule != 'all_to_all') {
        const connSpecList: string[] = [this._() + '"rule":"' + simLink.conn_spec.rule + '"'];
        Object.keys(simLink.conn_spec)
          .filter(key => key != 'rule')
          .map(key => {
            connSpecList.push(this._() + '"' + key + '": ' + simLink.conn_spec[key]);
          })
        script += ', conn_spec={';
        script += connSpecList.join(',')
        script += this.end() + '}';
      }
    }
    if (simLink.syn_spec) {
      const synSpecList: string[] = []
      if (simLink.syn_spec.hasOwnProperty('model')) {
        if (simLink.syn_spec.model != 'static_synapse') {
          synSpecList.push(this._() + '"model": "' + simLink.syn_spec.model + '"')
        }
      }
      Object.keys(simLink.syn_spec)
        .filter(key => key != 'model')
        .map(key => {
          synSpecList.push(this._() + '"' + key + '": ' + this._formatService.format(simLink.syn_spec[key]));
        })
      if (synSpecList.length > 0) {
        script += ', syn_spec={';
        script += synSpecList.join(',')
        script += this.end() + '}';
      }
    }
    script += ')';
    return script + '\n';
  }

  simulate(): string {
    let script: string = 'nest.Simulate(' + this.data.simulation.time.toFixed(1) + ')';
    return script + '\n';
  }

  getRecord(idx: number): string {
    const simNode = this.data.simulation.collections[idx];
    const model = this.data.simulation.getModel(simNode);

    const nodeVars = this.nodeVariable(simNode);
    let script: string = '{';
    script += this._(2) + '"events": nest.GetStatus(' + nodeVars + ', "events"),';

    if (model == 'spike_detector') {
      script += this._(2) + '"global_ids": nest.GetStatus(nest.GetConnections(None, ' + nodeVars + '), "source"),'
    } else {
      script += this._(2) + '"global_ids": nest.GetStatus(nest.GetConnections(' + nodeVars + '), "target"),'
    }

    script += this._(2) + '"recorder": {';
    script += this._(3) + '"idx": ' + idx + ',';
    script += this._(3) + '"model": "' + model + '",';
    script += this._(2) + '},';
    script += this._() + '}';
    return script;
  }

  getData(): string {
    let script: string = '';
    script += 'response = {';
    script += this._() + '"kernel": {"time": nest.GetKernelStatus("time")},'
    script += this._() + '"records": [';
    let records = this.data.app.nodes
      .filter(node => this.data.simulation.collections[node.idx].element_type == 'recorder')
      .map(node => this.getRecord(node.idx))
    script += records.join(',');
    script += ']';
    script += this.end() + '}';
    return script + '\n';
  }

}
