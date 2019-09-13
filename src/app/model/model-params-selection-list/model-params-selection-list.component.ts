import { Component, OnInit, Input } from '@angular/core';

import { ModelService } from '../model.service';

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

  hasParam(id) {
    if (this._modelService.hasModel(this.model)) {
      var config = this._modelService.config(this.model);
      return config.params.filter(param => param.id == id).length > 0
    }
  }

  addParam(id, value) {
    var param = {
      id: id,
      label: id,
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
    var config = this._modelService.config(this.model);
    config.params.push(param);
    config.params.sort((a, b) => a.id - b.id)
  }

  removeParam(id) {
    var config = this._modelService.config(this.model);
    config.params = config.params.filter(param => param.id != id);
  }

  changeParam(event) {
    var option = event.option.value;
    if (event.option.selected) {
      this.addParam(option.id, option.value)
    } else {
      this.removeParam(option.id)
    }
  }

}
