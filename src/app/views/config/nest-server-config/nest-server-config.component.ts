import { Component, OnInit } from '@angular/core';

import { NESTServer } from '../../../components/server/nestServer';


@Component({
  selector: 'app-nest-server-config',
  templateUrl: './nest-server-config.component.html',
  styleUrls: ['./nest-server-config.component.scss']
})
export class NestServerConfigComponent implements OnInit {
  public nestServer: NESTServer;

  constructor() {
    this.nestServer = new NESTServer();
  }

  ngOnInit() {
  }

  get config(): any {
    return this.nestServer.config;
  }

  set config(value: any) {
    this.nestServer.config = value;
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
