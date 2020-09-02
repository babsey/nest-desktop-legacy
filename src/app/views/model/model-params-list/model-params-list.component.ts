import { Component, OnInit, Input } from '@angular/core';

import { listAnimation } from '../../../animations/list-animation';

import { Model } from '../../../components/model/model';

import { ModelService } from '../../../services/model/model.service';


@Component({
  selector: 'app-model-params-list',
  templateUrl: './model-params-list.component.html',
  styleUrls: ['./model-params-list.component.scss'],
  animations: [
    listAnimation
  ]
})
export class ModelParamsListComponent implements OnInit {
  @Input() modelId: string = '';

  constructor(
    private _modelService: ModelService,
  ) {
  }

  ngOnInit() {
  }

  get defaults(): any[] {
    return this._modelService.defaults;
  }

  get defaultsKeys(): string[] {
    return Object.keys(this.defaults);
  }

  hasParam(paramId: string): boolean {
    if (this._modelService.hasModel(this.modelId)) {
      const model: Model = this._modelService.getModel(this.modelId);
      return model.params.filter((param: any) => param.id === paramId).length > 0;
    }
    return false
  }

}
