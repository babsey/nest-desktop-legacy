import { Component, OnInit } from '@angular/core';

import { ConfigService } from '../../../components/config';


@Component({
  selector: 'app-config',
  templateUrl: './app-config.component.html',
  styleUrls: ['./app-config.component.scss']
})
export class AppConfigComponent implements OnInit {
  private _config: ConfigService;

  constructor () {
    this._config = new ConfigService('App');
  }

  ngOnInit() {
  }

  get config(): any {
    return this._config.data;
  }

  onSelectionChange(event: any): void {
    const config: any = this.config;
    config[event.option.value] = event.option.selected;
    this._config.data = config;
  }

}
