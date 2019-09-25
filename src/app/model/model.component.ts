import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AppConfigService } from '../config/app-config/app-config.service';
import { ModelService } from './model.service';
import { NavigationService } from '../navigation/navigation.service';


@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})
export class ModelComponent implements OnInit {
  public enabled: boolean = false;

  constructor(
    private _appConfigService: AppConfigService,
    private _navigationService: NavigationService,
    private route: ActivatedRoute,
    public _modelService: ModelService,
  ) { }

  ngOnInit() {
    let paramMap = this.route.snapshot.paramMap;
    let model = paramMap.get('model');
    if (model) {
      this._modelService.selectModel(model);
    }
  }

  advanced() {
    return this._appConfigService.config['app'].advanced;
  }

  addModel() {
    var model = this._modelService.selectedModel;
    var config = {
      id: model,
      element_type: this._modelService.elementType,
      label: '',
      params: []
    };
    this._modelService.models[model] = config;
    // this._modelService.save(config)
  }

  removeModel() {
    var model = this._modelService.selectedModel;
    delete this._modelService.models[model]
    // this._modelService.delete(this.model)
  }

  changeModel(event) {
    if (event.checked) {
      this.addModel();
    } else {
      this.removeModel();
    }
    this._modelService.enabledModel = this._modelService.hasModel();
    this._modelService.update.emit()
  }

}
