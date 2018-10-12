import { Component, OnInit } from '@angular/core';

import { ConfigService } from '../shared/services/config/config.service';
import { ModelService } from '../shared/services/model/model.service';

import {
  faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  public faEllipsisV = faEllipsisV;


  constructor(
    public _configService: ConfigService,
    public _modelService: ModelService,
  ) { }

  ngOnInit() {
    this._configService.check()
  }

  isEnabled() {
    var enabledModels = this._configService.listModels();
    return enabledModels.indexOf(this._modelService.selectedModel) != -1
  }

}
