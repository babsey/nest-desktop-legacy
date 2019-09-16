import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

var STORAGE_NAME = 'app-config';


@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
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
    var appVersion = environment.VERSION.split('.');
    var configVersion = this.config.version.split('.');
    this.status.valid = appVersion[0] == configVersion[0] && appVersion[1] == configVersion[1];
  }

  fromFiles() {
    var files = [
      'app',
      'nest-server',
      'user',
      'groups',
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

  urlRoot() {
    var server = this.config['nest-server'];
    var host = server['host'] || window.location.host.split(':')[0] || 'localhost';
    return 'http://' + host + ':' + server['port'];
  }

}
