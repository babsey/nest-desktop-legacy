import { Injectable } from '@angular/core';

import { DataService } from '../../services/data/data.service';
import { FormatService } from '../../services/format/format.service';


@Injectable({
  providedIn: 'root'
})
export class NetworkScriptService {

  constructor(
    private _dataService: DataService,
    private _formatService: FormatService,
  ) { }


  kernel(kernel) {
    var str = '\n# Reset kernel\n';
    str += 'nest.ResetKernel()\n';
    str += 'nest.SetKernelStatus({\n';
    str += '\t"resolution": ' + this._formatService.format(kernel.resolution) + ',\n';
    str += '})\n';
    return str + '\n'
  }

  nodeVariable(node) {
    return node.model.split('_').map(a => a[0]).join('') + (node.idx + 1);
  }

  create(node) {
    var str = '';
    str += this.nodeVariable(node) + ' = nest.Create("' + node.model + '"';
    if (node.n > 1) {
      str += ', ' + node.n;
    }
    var params = [];
    Object.keys(node.params).map(param => {
      params.push('\t"' + param + '": \t' + this._formatService.format(node.params[param]));
    })
    if (params.length > 0) {
      str += ', params={\n';
      str += params.join(',\n')
      str += '\n}';
    }
    str += ')';
    return str + '\n';
  }

  connect(link) {
    var str = '';
    var pre = this._dataService.data.collections[link.pre];
    var post = this._dataService.data.collections[link.post];
    if (['multimeter', 'voltmeter'].includes(post.model)) {
      post = [pre, pre = post][0];
    }
    str += 'nest.Connect(' + this.nodeVariable(pre) + ', ' + this.nodeVariable(post);
    if ('conn_spec' in link) {
      if (link.conn_spec.rule != 'all_to_all') {
        str += ', conn_spec="' + link.conn_spec.rule + '"';
      }
    }
    if ('syn_spec' in link) {
      var syn_spec = []
      if (link.syn_spec.model != 'static_synapse') {
          syn_spec.push('\t"model": "' + link.syn_spec.model + '", ')
        }
      Object.keys(link.syn_spec).filter(key => key != 'model').map(key => {
        syn_spec.push('\t"' + key+'": ' + this._formatService.format(link.syn_spec[key]));
      })
      if (syn_spec.length > 0) {
        str += ', syn_spec={\n';
        str += syn_spec.join(', \n')
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

  getData(rec) {
    var str = '\n# Get data\n';
    str += 'rec' + rec.idx + ' = nest.GetStatus(' + this.nodeVariable(rec) + ', "events")[0]'
    return str + '\n'
  }

}
