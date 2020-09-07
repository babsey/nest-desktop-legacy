import { Component, OnInit } from '@angular/core';

import { NESTServer } from '../../../components/server/nestServer';


@Component({
  selector: 'app-nest-server-config',
  templateUrl: './nest-server-config.component.html',
  styleUrls: ['./nest-server-config.component.scss']
})
export class NestServerConfigComponent implements OnInit {
  private _nestServer: NESTServer;

  constructor() {
    this._nestServer = new NESTServer();
  }

  ngOnInit() {
  }

  get config(): any {
    return this._nestServer.config;
  }

  set config(value: any) {
    this._nestServer.config = value;
  }

  get nestServer(): NESTServer {
    return this._nestServer;
  }

  onSelectionChange(event: any): void {
    let config = this.config;
    config[event.option.value] = event.option.selected;
    this.config = config;
  }

  onChange(event: any): void {
    let config = this.config;
    config[event.target.name] = event.target.value;
    this.config = config;
  }
}
