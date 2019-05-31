import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

var STORAGE_NAME = 'chart-config';

@Injectable({
  providedIn: 'root'
})
export class ChartConfigService {
  public config: any;
  public status: any = {
    loading: false,
    ready: false,
    valid: false,
  };

  constructor() { }

  init() {
    this.status.loading = true;
    this.status.ready = false;
    var configJSON = localStorage.getItem(STORAGE_NAME)
    if (configJSON) {
      this.config = JSON.parse(configJSON);
    } else {
      this.config = require('./chart-config.json');
      this.config['version'] = environment.VERSION;
      this.save()
    }
    this.status.ready = true;
    this.status.loading = false;
    this.status.valid = this.config.version == environment.VERSION;
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
