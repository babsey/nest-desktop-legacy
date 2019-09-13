import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

var STORAGE_NAME = 'network-config';


@Injectable({
  providedIn: 'root'
})
export class NetworkConfigService {
  public config: any = {};
  public status: any = {
    loading: false,
    ready: false,
    valid: false
  };

  constructor(
  ) {
  }

  init() {
    this.status.loading = true;
    this.status.ready = false;
    let configJSON = localStorage.getItem(STORAGE_NAME);
    if (configJSON) {
      this.config = JSON.parse(configJSON);
    } else {
      this.fromFiles()
      this.save()
    }
    this.status.ready = true;
    this.status.loading = false;
    this.status.valid = this.config.version == environment.VERSION;
  }

  fromFiles() {
    var files = [
      'color',
      'connection',
      'label',
      'mask',
      'node',
      'projections',
      'receptor',
      'spatial',
    ];
    for (var idx in files) {
      var filename = files[idx];
      var configData = require('./configs/' + filename + '.json');
      this.config[filename] = configData;
    }
    this.config['version'] = environment.VERSION;
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
