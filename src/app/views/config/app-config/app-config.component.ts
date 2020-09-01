import { Component, OnInit } from '@angular/core';

import { Config } from '../../../components/config';


@Component({
  selector: 'app-config',
  templateUrl: './app-config.component.html',
  styleUrls: ['./app-config.component.scss']
})
export class AppConfigComponent implements OnInit {
  private _config: Config;

  constructor () {
    this._config = new Config('App');
  }

  ngOnInit() {
  }

  get config(): any {
    return this._config.data;
  }

  onSelectionChange(event: any): void {
    let config: any = this.config;
    config[event.option.value] = event.option.selected;
    this._config.data = config;
  }

}
