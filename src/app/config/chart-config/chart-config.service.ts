import { Injectable } from '@angular/core';

declare function require(url: string);

var STORAGE_NAME = 'chart-config';

@Injectable({
  providedIn: 'root'
})
export class ChartConfigService {
  public config: any;
  public ready: boolean = false;

  constructor() { }

  init() {
    var configJSON = localStorage.getItem(STORAGE_NAME)
      if (configJSON) {
        this.config = JSON.parse(configJSON);
      } else {
        this.config = require('./chart-config.json');
        this.save()
      }
      this.ready = true;
    }

  save() {
    let configJSON = JSON.stringify(this.config);
    localStorage.setItem(STORAGE_NAME, configJSON);
  }
}
