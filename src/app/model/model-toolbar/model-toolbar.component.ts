import { Component, OnInit, ViewChild } from '@angular/core';

import { ModelService } from '../model.service';

import { enterAnimation } from '../../animations/enter-animation';


@Component({
  selector: 'app-model-toolbar',
  templateUrl: './model-toolbar.component.html',
  styleUrls: ['./model-toolbar.component.scss'],
  animations: [enterAnimation],
})
export class ModelToolbarComponent implements OnInit {

  constructor(
    public _modelService: ModelService,
  ) { }

  ngOnInit() {
  }

  hasModel(): boolean {
    return this._modelService.hasModel(this._modelService.selectedModel)
  }

  addModel(): void {
    var model = this._modelService.selectedModel;
    var config = {
      id: model,
      element_type: this._modelService.defaults.element_type,
      label: model,
      params: []
    };
    if (this._modelService.defaults.hasOwnProperty('recordables')) {
      config['recordables'] = this._modelService.defaults.recordables;
    }
    this._modelService.models[model] = config;
    this._modelService.save(config)
    this._modelService.update.emit()
  }

  deleteModel(): void {
    var model = this._modelService.selectedModel;
    delete this._modelService.models[model]
    this._modelService.delete(model)
    this._modelService.update.emit()
  }


}
