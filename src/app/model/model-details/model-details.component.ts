import { Component, OnInit } from '@angular/core';

import { ConfigService } from '../../config/config.service';
import { ModelService } from '../model.service';

@Component({
  selector: 'app-model-details',
  templateUrl: './model-details.component.html',
  styleUrls: ['./model-details.component.css']
})
export class ModelDetailsComponent implements OnInit {
  public objectKeys = Object.keys;

  constructor(
    public _configService: ConfigService,
    public _modelService: ModelService,
  ) {
  }

  ngOnInit() {
  }

  save() {
    var config = this._configService.config.nest;
    this._configService.save('nest', this._configService.config.nest)
  }

  toggleParam(event, param) {
    if (event.checked) {
      this._configService.addParam(param, this._modelService.defaults[param]);
    } else {
      this._configService.removeParam(param);
    }
  }

  isEnabled(param) {
    if (this._configService.selectedModel) {
      return this._configService.selectedModel.params.indexOf(param) != -1
    }
  }
}
