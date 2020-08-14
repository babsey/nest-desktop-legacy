import { Component, OnInit } from '@angular/core';

import { Config } from '../../../components/config';


@Component({
  selector: 'app-project-config',
  templateUrl: './project-config.component.html',
  styleUrls: ['./project-config.component.scss']
})
export class ProjectConfigComponent implements OnInit {
  private _config: Config;

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
    config.databases.project[event.target.name] = event.target.value;
    this._config.data = config;
  }

}
