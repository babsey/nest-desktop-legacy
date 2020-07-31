import { Component, OnInit } from '@angular/core';

import { AppService } from '../../../services/app/app.service';


@Component({
  selector: 'app-model-config',
  templateUrl: './model-config.component.html',
  styleUrls: ['./model-config.component.scss']
})
export class ModelConfigComponent implements OnInit {

  constructor(
    public _appService: AppService,
  ) { }

  ngOnInit() {
  }

  get config(): any {
    return this._appService.data.config.data;
  }

}
