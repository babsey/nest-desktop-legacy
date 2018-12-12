import { Pipe, PipeTransform } from '@angular/core';

import { ConfigService } from '../../config/config.service';


@Pipe({
  name: 'params'
})
export class ParamsPipe implements PipeTransform {

  constructor(
    private _configService: ConfigService
  ) {
  }

  transform(value: any, args?: any): any {
    let config = this._configService.config.nest.model[value.model];
    let params = config.params.map(param => {
      return {
        show: true,
        id: param,
        label: config.options[param].label,
        value: value.params[param],
        unit: config.options[param].unit,
      }
    })
    return params;
  }

}
