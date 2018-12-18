import { Component, OnInit } from '@angular/core';

import { ConfigService } from '../../config/config.service';
import { ModelService } from '../model.service';

@Component({
  selector: 'app-model-config',
  templateUrl: './model-config.component.html',
  styleUrls: ['./model-config.component.css']
})
export class ModelConfigComponent implements OnInit {

  constructor(
    public _configService: ConfigService,
    public _modelService: ModelService,
  ) { }

  ngOnInit() {
  }

  save() {
    this._configService.save('nest', this._configService.config.nest);
  }

}
