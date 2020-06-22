import { Injectable } from '@angular/core';

import { FormatService } from '../../services/format/format.service';

import { Data } from '../../classes/data';
import { AppNode } from '../../classes/appNode';
import { AppModel } from '../../classes/appModel';
import { SimCollection } from '../../classes/simCollection';
import { SimModel } from '../../classes/simModel';
import { SimConnectome } from '../../classes/simConnectome';


@Injectable({
  providedIn: 'root'
})
export class SimulationScriptService {
  private modelLabel: any = {
    'stimulator': 'stim',
    'neuron': 'neuron',
    'recorder': 'rec',
  };

  constructor(
    private _formatService: FormatService,
  ) { }

  _(n: number = 1): string {
    return '\n' + '    '.repeat(n)
  }

  end(): string {
    return '\n';
  }

  script(data: Data): string {
    let script: string = '';
    script += this.importModules();
    script += this.randomSeed(data.simulation.random_seed);

    script += '\n\n';
    if (data.simulation.hasOwnProperty('kernel')) {
      script += '# Set kernel status\n';
      script += this.setKernelStatus(data.simulation.kernel);
    }

    script += '\n\n';
    script += '# Copy models\n';
    data.simulation.collections.map(node => {
      const model: SimModel = data.simulation.models[node.model];
      script += this.copyModel(node, model, data.app.models[node.model]);
    })

    script += '\n\n';
    script += '# Create nodes\n';
    data.simulation.collections.map(node => {
      const model: SimModel = data.simulation.models[node.model];
      // script += this.copyModel(node, model, data.app.models[node.model]);
      script += this.createNode(node);
    })

    script += '\n\n';
    script += '# Connect nodes\n';
    data.simulation.connectomes.map(connection => {
      script += this.connectNodes(connection, data.simulation.collections);
    })

    script += '\n\n';
    script += '# Run simulation\n';
    script += this.simulate(data.simulation.time);

    script += '\n\n';
    script += '# Get events\n';
    script += this.getData(data.simulation);
    return script;
  }

  nodeVariable(model: string): string {
    const modelName: string[] = model.split('-');
    const modelPrefix: string = this.modelLabel[modelName[0]];
    return 'node' + modelName[1].toUpperCase();
    // return modelPrefix + modelName[1].toUpperCase();
  }

  importModules(): string {
    let script: string = '';
    script += 'import nest\n';
    script += 'import numpy as np\n';
    return script + '\n\n';
  }

  randomSeed(seed: number = 0, local_num_threads: number = 1): string {
    let script: string = '';
    script += 'np.random.seed(' + (seed) + ')\n';
    return script;
  }

  setKernelStatus(status: any): string {
    if (status == undefined) return ''
    const local_num_threads = parseInt(status.hasOwnProperty('local_num_threads') ? status['local_num_threads'] : 1);
    let script: string = '';
    script += 'nest.ResetKernel()\n';
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

  filterParams(params: any, display: string[], node: SimCollection): any {
    let filteredParams: any = {};
    if (display) {
      display.map(key => {
        if (node.hasOwnProperty('params')) {
          if (node.params.hasOwnProperty(key)) return
        }
        filteredParams[key] = params[key];
      });
    }
    return filteredParams;
  }

  copyModel(node: SimCollection, model: SimModel, appModel: AppModel): string {
    let script: string = '';
    script += 'nest.CopyModel("' + model.existing + '", "' + node.model + '"';
    if (model.hasOwnProperty('params')) {
      script += this.params(this.filterParams(model.params, appModel['display'], node));
    }
    script += ')';
    return script + '\n';
  }

  createNode(node: SimCollection): string {
    let script: string = '';
    script += this.nodeVariable(node.model) + ' = nest.Create("' + node.model + '", ' + node.n;
    script += this.params(node.params);
    script += ')';
    return script + '\n';
  }

  connectNodes(connection: SimConnectome, nodes: SimCollection[]): string {
    let script: string = '';
    let source = nodes[connection.source];
    let target = nodes[connection.target];
    if (['multimeter', 'voltmeter'].includes(target.model)) {
      target = [source, source = target][0];
    }
    script += 'nest.Connect(' + this.nodeVariable(source.model) + ', ' + this.nodeVariable(target.model);
    if (connection.conn_spec) {
      if (connection.conn_spec.rule != 'all_to_all') {
        const connSpecList: string[] = [this._() + '"rule":"' + connection.conn_spec.rule + '"'];
        Object.keys(connection.conn_spec).filter(key => key != 'rule').map(key => {
          connSpecList.push(this._() + '"' + key + '": ' + connection.conn_spec[key]);
        })
        script += ', conn_spec={';
        script += connSpecList.join(',')
        script += this.end() + '}';
      }
    }
    if (connection.syn_spec) {
      const synSpecList: string[] = []
      if (connection.syn_spec.hasOwnProperty('model')) {
        synSpecList.push(this._() + '"model": "' + connection.syn_spec['model'] + '"')
      }
      Object.keys(connection.syn_spec).filter(key => key != 'model').map(key => {
        synSpecList.push(this._() + '"' + key + '": ' + this._formatService.format(connection.syn_spec[key]));
      })
      if (synSpecList.length > 0) {
        script += ', syn_spec={';
        script += synSpecList.join(',')
        script += this.end() + '}';
      }
    }
    script += ')';
    return script + '\n'
  }

  simulate(time: number): string {
    let script: string = 'nest.Simulate(' + time.toFixed(1) + ')';
    return script + '\n'
  }

  getRecord(node: SimCollection, idx: number, neuron: string): string {
    const nodeVars = this.nodeVariable(node.model);
    let script: string = '{';
    script += this._(2) + '"events": nest.GetStatus(' + nodeVars + ', "events")[0],';

    if (neuron == 'target') {
      script += this._(2) + '"global_ids": nest.GetStatus(nest.GetConnections(' + nodeVars + '),"target"),'
    } else {
      script += this._(2) + '"global_ids": nest.GetStatus(nest.GetConnections(None, ' + nodeVars + '), "source"),'
    }

    script += this._(2) + '"recorderIdx": ' + idx + ',';
    // script += this._(3) + '"idx": ' + idx + ',';
    // script += this._(3) + '"model": nest.GetStatus(' + nodeVars + ', "model"),';
    // script += this._(2) + '},';
    // script += this._(2) + '"senders": list(set(nest.GetStatus(' + nodeVars + ', "events")[0]["senders"]))';
    script += this._() + '}';
    return script
  }

  getData(simulation: any): string {
    let script: string = '';
    script += 'response = {';
    script += this._() + '"kernel": {"time": nest.GetKernelStatus("time")},'
    script += this._() + '"records": [';
    let records = [];
    simulation.collections.map((node, idx) => {
      if (node.element_type == 'recorder') {
        const simModel = simulation.models[node.model];
        const neuron = simModel.existing == 'spike_detector' ? 'source' : 'target';
        records.push(this.getRecord(node, idx, neuron))
      }
    })
    script += records.join(',');
    script += ']';
    script += this.end() + '}';
    return script + '\n'
  }

}
