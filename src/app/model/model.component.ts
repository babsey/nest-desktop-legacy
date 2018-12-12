import { Component, OnInit } from '@angular/core';

import { ConfigService } from '../config/config.service';
import { ModelService } from './model.service';

import {
  faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css']
})
export class ModelComponent implements OnInit {
  public faEllipsisV = faEllipsisV;

  constructor(
    public _configService: ConfigService,
    public _modelService: ModelService,
  ) { }

  ngOnInit() {
  }

  isEnabled() {
    var enabledModels = this._configService.listModels();
    return enabledModels.indexOf(this._modelService.selectedModel) != -1
  }


}
