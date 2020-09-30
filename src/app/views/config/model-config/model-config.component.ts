import { Component, OnInit } from '@angular/core';

import { Config } from '../../../components/config';


@Component({
  selector: 'app-model-config',
  templateUrl: './model-config.component.html',
  styleUrls: ['./model-config.component.scss']
})
export class ModelConfigComponent implements OnInit {
  private _config: Config;

  constructor() {
    this._config = new Config('App');
   }

  ngOnInit() {
  }

  get config(): any {
    return this._config.config;
  }

  set config(value: any) {
    this._config.updateConfig(value);
  }

  onChange(event: any): void {
    const config: any = this.config;
    config.databases.model[event.target.name] = event.target.value;
    this._config.config = config;
  }

}
