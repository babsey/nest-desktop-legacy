import { Component, OnInit } from '@angular/core';

import { ModelConfigService } from './model-config.service';


@Component({
  selector: 'app-model-config',
  templateUrl: './model-config.component.html',
  styleUrls: ['./model-config.component.scss']
})
export class ModelConfigComponent implements OnInit {

  constructor(
    public _modelConfigService: ModelConfigService,
  ) { }

  ngOnInit() {
  }

  save() {
    this._modelConfigService.save()
  }


}
