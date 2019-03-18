import { Injectable } from '@angular/core';

declare function require(url: string);

var STORAGE_NAME = 'db-config';

@Injectable({
  providedIn: 'root'
})
export class DBConfigService {
  public config: any = {};
  public ready: boolean;
  public version: string;

  constructor() { }

    init() {
      var configJSON = localStorage.getItem(STORAGE_NAME);
      if (configJSON) {
        this.config  = JSON.parse(configJSON);
        this.version = this.config.version;
      } else {
        this.config = require('./db-config.json');
        this.save()
      }
      this.ready = true;
    }

    list() {
      return Object.keys(this.config).filter(key => key != 'version').map(key => this.config[key])
    }

    save() {
      let configJSON = JSON.stringify(this.config);
      localStorage.setItem(STORAGE_NAME, configJSON);
    }

    reset() {
      this.ready = false;
      localStorage.removeItem(STORAGE_NAME)
      this.config = require('./db-config.json');
      this.save()
      this.ready = true;
    }

}
