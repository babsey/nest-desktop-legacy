import { Pipe, PipeTransform } from '@angular/core';

import { ConfigService } from '../../config/config.service';

@Pipe({
  name: 'nodes'
})
export class NodesPipe implements PipeTransform {

  constructor(
    private _configService: ConfigService,
  ) {
  }

  transform(value: any, args?: any): any {
    if (value == undefined) {
      return []
    }

    if (value.length == 0) {
      return []
    }

    return value.map(d => {
      let config = this._configService.config.nest.model[d.model];
      let params = config.params.map(param => {
        return {
          show: true,
          id: param,
          label: config.options[param].label,
          value: (param in d.params) ? d.params[param] : config.options[param].value,
          unit: config.options[param].unit,
        }
      })
      var node = {
        show: true,
        idx: d.idx,
        model: d.model,
        label: config.label,
        n: d.n || 1,
        params: params,
      }
      if (d['color']) {
        node['color'] = d['color']
      }
      return node
    })
  }

}
