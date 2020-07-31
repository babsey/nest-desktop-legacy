import { Component, OnInit, ViewChild } from '@angular/core';

import { enterAnimation } from '../../../animations/enter-animation';

import { Model } from '../../../components/model/model';

import { AppService } from '../../../services/app/app.service';
import { ModelService } from '../../../services/model/model.service';


@Component({
  selector: 'app-model-toolbar',
  templateUrl: './model-toolbar.component.html',
  styleUrls: ['./model-toolbar.component.scss'],
  animations: [enterAnimation],
})
export class ModelToolbarComponent implements OnInit {

  constructor(
    public _appService: AppService,
    public _modelService: ModelService,
  ) { }

  ngOnInit() {
  }

  addModel(): void {
    const modelId: string = this._modelService.selectedModel;
    const model: any = {
      id: modelId,
      elementType: this._modelService.defaults.elementType,
      label: modelId,
      params: [],
    };
    if (this._modelService.defaults.hasOwnProperty('recordables')) {
      model['recordables'] = this._modelService.defaults.recordables;
    }
    this._appService.data.addModel(model);
    this._modelService.update.emit();
  }

  deleteModel(): void {
    const model: string = this._modelService.selectedModel;
    this._appService.data.deleteModel(model);
    this._modelService.update.emit();
  }

  saveModel(): void {
    const model: Model = this._appService.data.getModel(this._modelService.selectedModel);
    if (model) {
      this._appService.data.saveModel(model.serialize('db'));
    }
  }

}
