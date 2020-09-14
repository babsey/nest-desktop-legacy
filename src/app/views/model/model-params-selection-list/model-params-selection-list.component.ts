import { Component, OnInit, Input } from '@angular/core';

import { Model } from '../../../components/model/model';
import { Parameter } from '../../../components/parameter';

import { ModelService } from '../../../services/model/model.service';


@Component({
  selector: 'app-model-params-selection-list',
  templateUrl: './model-params-selection-list.component.html',
  styleUrls: ['./model-params-selection-list.component.scss']
})
export class ModelParamsSelectionListComponent implements OnInit {
  @Input() modelId = '';

  constructor(
    private _modelService: ModelService,
  ) { }

  ngOnInit() {
  }

  get defaults(): any[] {
    return this._modelService.defaults;
  }

  get defaultsKeys(): string[] {
    return Object.keys(this.defaults);
  }

  hasModel(): boolean {
    return this._modelService.hasModel(this.modelId);
  }

  hasParam(id: string): boolean {
    if (this.hasModel()) {
      const model: Model = this._modelService.getModel(this.modelId);
      return model.params.filter((param: Parameter) => param.id === id).length > 0;
    }
    return false;
  }

  changeParam(event: any): void {
    const model: Model = this._modelService.getModel(this.modelId);
    const option: any = event.option.value;
    if (event.option.selected) {
      model.newParameter(option.id, option.value);
    } else {
      model.removeParameter(option.id);
    }
  }

}
