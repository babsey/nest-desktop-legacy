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
    public appService: AppService,
    public modelService: ModelService,
  ) { }

  ngOnInit() {
  }

  addModel(): void {
    const modelId: string = this.modelService.selectedModel;
    const model: any = {
      id: modelId,
      elementType: this.modelService.defaults.element_type,
      label: modelId,
      params: [],
    };
    if (this.modelService.defaults.hasOwnProperty('recordables')) {
      model['recordables'] = this.modelService.defaults.recordables;
    }
    this.appService.app.addModel(model);
    this.modelService.update.emit();
  }

  deleteModel(): void {
    const model: string = this.modelService.selectedModel;
    this.appService.app.deleteModel(model);
    this.modelService.update.emit();
  }

  saveModel(): void {
    const model: Model = this.appService.app.getModel(this.modelService.selectedModel);
    if (model) {
      this.appService.app.saveModel(model);
    }
  }

}
