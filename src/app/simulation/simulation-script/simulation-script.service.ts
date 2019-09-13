import { Injectable } from '@angular/core';

import { FormatService } from '../../services/format/format.service';


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

  nodeVariable(model) {
    var modelName = model.split('-');
    var modelPrefix = this.modelLabel[modelName[0]];
    return modelPrefix + modelName[1];
  }

  kernel(kernel) {
    var str = '';
    str += 'nest.ResetKernel()\n';
    str += 'nest.SetKernelStatus({\n';
    str += '\t"resolution": ' + this._formatService.format(kernel.resolution) + ',\n';
    str += '})\n';
    return str + '\n'
  }

  copyModel(existing, newModel, params=null) {
    var str = '';
    str += 'nest.CopyModel("' + existing + '", "' + newModel + '"';
    var paramsList = [];
    Object.keys(params).map(param => {
      if (param == 'record_from') {
        var record_from = params[param].map(r => '"' + r + '"');
        paramsList.push('\t"' + param + '": \t[' + record_from.join(',') + ']');
      } else {
        paramsList.push('\t"' + param + '": \t' + this._formatService.format(params[param]));
      }
    })
    if (paramsList.length > 0) {
      str += ', params={\n';
      str += paramsList.join(',\n')
      str += '\n}';
    }
    str += ')';
    return str + '\n';
  }

  create(model, n = 1) {
    var str = this.nodeVariable(model) + ' = nest.Create("' + model + '", ' + n + ')';
    return str + '\n';
  }

  connect(pre, post, connSpec = null, synSpec = null) {
    var str = '';
    if (['multimeter', 'voltmeter'].includes(post.model)) {
      post = [pre, pre = post][0];
    }
    str += 'nest.Connect(' + this.nodeVariable(pre.model) + ', ' + this.nodeVariable(post.model);
    if (connSpec) {
      if (connSpec.rule != 'all_to_all') {
        str += ', conn_spec="' + connSpec.rule + '"';
      }
    }
    if (synSpec) {
      var synSpecList = []
      if (synSpec.model == 'static_synapse') {
        synSpecList.push('\t"model": "' + synSpec.model + '"')
      }
      Object.keys(synSpec).filter(key => key != 'model').map(key => {
        synSpecList.push('\t"' + key + '": ' + this._formatService.format(synSpec[key]));
      })
      if (synSpecList.length > 0) {
        str += ', syn_spec={\n';
        str += synSpecList.join(', \n')
        str += '\n}';
      }
    }
    str += ')';
    return str + '\n'
  }

  simulate(time) {
    var str = '\n# Simulation\n';
    str += 'nest.Simulate(' + parseFloat(time).toFixed(1) + ')\n'
    return str + '\n'
  }

  getStatus(rec, key) {
    var str = '\n# Get data\n';
    str += this.nodeVariable(rec.model) + '_events = nest.GetStatus(' + this.nodeVariable(rec.model) + ', "'+ key +'")[0]'
    return str + '\n'
  }

}
