import { Component, OnInit } from '@angular/core';

import { ConfigService } from '../shared/services/config/config.service';
import { ModelService } from '../shared/services/model/model.service';

@Component({
  selector: 'app-model-edit',
  templateUrl: './model-edit.component.html',
  styleUrls: ['./model-edit.component.css']
})
export class ModelEditComponent implements OnInit {

  constructor(
    public _configService: ConfigService,
    public _modelService: ModelService,
  ) { }

  ngOnInit() {
  }

  save() {
    this._configService.save('nest', this._configService.config.nest)
  }

  valueChanged(param, event) {
    var value = event.target.value;
    var ticks = value.split(',');
    ticks = ticks.map(d => parseFloat(d));
    this._configService.selectedModel.options[param].viewSpec.ticks = ticks;
    this.save()
  }

}
