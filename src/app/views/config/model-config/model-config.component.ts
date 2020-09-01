import { Component, OnInit } from '@angular/core';

import { ConfigService } from '../../../components/config';


@Component({
  selector: 'app-model-config',
  templateUrl: './model-config.component.html',
  styleUrls: ['./model-config.component.scss']
})
export class ModelConfigComponent implements OnInit {
  private _config: ConfigService;

  constructor() {
    this._config = new ConfigService('App');
   }

  ngOnInit() {
  }

  get config(): any {
    return this._config.data;
  }

  onChange(event: any): void {
    let config: any = this.config;
    config.databases.model[event.target.name] = event.target.value;
    this._config.data = config;
  }

}
