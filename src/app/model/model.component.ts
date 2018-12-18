import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ConfigService } from '../config/config.service';
import { ModelService } from './model.service';
import { NavigationService } from '../navigation/navigation.service';

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
    private _navigationService: NavigationService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
      let paramMap = this.route.snapshot.paramMap;
      let model = paramMap.get('model');
      if (model) {
        this._modelService.selectModel(model);
        this._modelService.getDoc(model);
        this._modelService.getDefaults(model);
      }
  }

  isEnabled() {
    var enabledModels = this._configService.listModels();
    return enabledModels.indexOf(this._modelService.selectedModel) != -1
  }


}
