import { Component, OnInit } from '@angular/core';

import { Config } from '../../../components/config';


@Component({
  selector: 'app-model-config',
  templateUrl: './model-config.component.html',
  styleUrls: ['./model-config.component.scss']
})
export class ModelConfigComponent implements OnInit {
  private _config: Config

  constructor() {
    this._config = new Config('App');
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
