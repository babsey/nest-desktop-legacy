import { Component, OnInit } from '@angular/core';

import { ConfigService } from '../../../components/config';


@Component({
  selector: 'app-project-config',
  templateUrl: './project-config.component.html',
  styleUrls: ['./project-config.component.scss']
})
export class ProjectConfigComponent implements OnInit {
  private _config: ConfigService;

  constructor() {
    this._config = new ConfigService('App');
   }

  ngOnInit() {
  }

  get config(): any {
    return this._config.data;
  }

  set config(value: any) {
    this._config.update(value);
  }

  onChange(event: any): void {
    const data: any = {};
    data[event.target.name] = event.target.value;
    this.config = data;
  }

}
