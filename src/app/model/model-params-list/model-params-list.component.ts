import { Component, OnInit, Input } from '@angular/core';

import { AppConfigService } from '../../config/app-config/app-config.service';
import { ModelService } from '../model.service';

@Component({
  selector: 'app-model-params-list',
  templateUrl: './model-params-list.component.html',
  styleUrls: ['./model-params-list.component.scss']
})
export class ModelParamsListComponent implements OnInit {
  @Input() model: string = '';
  public objectKeys = Object.keys;

  constructor(
    private _appConfigService: AppConfigService,
    public _modelService: ModelService,
  ) {
  }

  ngOnInit() {
  }

  hasParam(id) {
    if (this._modelService.hasModel(this.model)) {
      var config = this._modelService.config(this.model);
      return config.params.filter(param => param.id == id).length > 0
    }
  }

}
