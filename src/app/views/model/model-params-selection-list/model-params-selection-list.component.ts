import { Component, OnInit, Input } from '@angular/core';

import { ModelService } from '../../../services/model/model.service';


@Component({
  selector: 'app-model-params-selection-list',
  templateUrl: './model-params-selection-list.component.html',
  styleUrls: ['./model-params-selection-list.component.scss']
})
export class ModelParamsSelectionListComponent implements OnInit {
  @Input() model: string = '';
  public objectKeys = Object.keys;

  constructor(
    public _modelService: ModelService,
  ) {
  }

  ngOnInit() {
  }

  hasParam(id: string): boolean {
    if (this._modelService.hasModel(this.model)) {
      const settings: any = this._modelService.getSettings(this.model);
      return settings.params.filter(param => param.id == id).length > 0;
    }
    return false
  }

  addParam(paramId: string, value: any): void {
    const param: any = {
      id: paramId,
      label: paramId,
      value: value,
      level: 1,
      input: 'valueSlider',
      min: 0,
      max: 100,
      step: 1
    };
    if (Array.isArray(value)) {
      param.input = 'arrayInput';
    }
    const settings: any = this._modelService.getSettings(this.model);
    settings.params.push(param);
    settings.params.sort((a, b) => a.id - b.id)
  }

  removeParam(paramId: string): void {
    const settings: any = this._modelService.getSettings(this.model);
    settings.params = settings.params.filter(param => param.id != paramId);
  }

  changeParam(event: any): void {
    const option: any = event.option.value;
    if (event.option.selected) {
      this.addParam(option.id, option.value)
    } else {
      this.removeParam(option.id)
    }
  }

}
