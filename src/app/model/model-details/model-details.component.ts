import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppConfigService } from '../../config/app-config/app-config.service';
import { ModelService } from '../model.service';

@Component({
  selector: 'app-model-details',
  templateUrl: './model-details.component.html',
  styleUrls: ['./model-details.component.css']
})
export class ModelDetailsComponent implements OnInit, OnChanges {
  @Input() model: string = '';
  public defaults: any = {};
  public objectKeys = Object.keys;
  public progress: boolean = false;

  constructor(
    private _appConfigService: AppConfigService,
    public _modelService: ModelService,
    private http: HttpClient,
  ) {
  }

  ngOnInit() {
    this.requestModelDefaults()
  }

  ngOnChanges() {
    this.requestModelDefaults()
  }

  requestModelDefaults() {
    var urlRoot = this._appConfigService.urlRoot()
    var data = {
      'model': this.model,
    };
    this.defaults = {};
    this.progress = true;
    setTimeout(() => {
      this.http.post(urlRoot + '/api/nest/GetDefaults', data)
        .subscribe(data => {
          this.progress = false;
          this.defaults = data['response']['data'];
          this._modelService.elementType = this.defaults.element_type;
        })
    }, 500)
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
