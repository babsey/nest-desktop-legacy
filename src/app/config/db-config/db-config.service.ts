import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

var STORAGE_NAME = 'db-config';


@Injectable({
  providedIn: 'root'
})
export class DBConfigService {
  public config: any = {};
  public status: any = {
    loading: false,
    ready: false,
    valid: false,
  };
  public version: string;

  constructor() { }

  init() {
    this.status.loading = true;
    this.status.ready = false;
    var configJSON = localStorage.getItem(STORAGE_NAME);
    if (configJSON) {
      this.config = JSON.parse(configJSON);
      this.version = this.config.version;
    } else {
      this.config = require('./db-config.json');
      this.config['version'] = environment.VERSION;
      this.save()
    }
    this.status.loading = false;
    this.status.ready = true;
    var appVersion = environment.VERSION.split('.');
    var configVersion = this.config.version.split('.');
    this.status.valid = appVersion[0] == configVersion[0] && appVersion[1] == configVersion[1];
  }

  list() {
    return Object.keys(this.config).filter(key => key != 'version').map(key => this.config[key])
  }

  save() {
    let configJSON = JSON.stringify(this.config);
    localStorage.setItem(STORAGE_NAME, configJSON);
  }

  reset() {
    localStorage.removeItem(STORAGE_NAME)
    this.init()
  }

}
