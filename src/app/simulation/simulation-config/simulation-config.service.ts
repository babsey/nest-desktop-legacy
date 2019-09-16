import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

var STORAGE_NAME = 'simulation-config';


@Injectable({
  providedIn: 'root'
})
export class SimulationConfigService {
  public config: any = {
    level: -1,
    bottomSheetOpened: true,
    showSlider: false,
    showSketch: true,
  };
  public status: any = {
    loading: false,
    ready: false,
    valid: false,
  }

  constructor() { }

  init() {
    this.status.loading = true;
    this.status.ready = false;
    var configJSON = localStorage.getItem(STORAGE_NAME);
    if (configJSON) {
      this.config = JSON.parse(configJSON);
    } else {
      this.fromFiles()
      this.save()
    }
    this.status.loading = false;
    this.status.ready = true;
    var appVersion = environment.VERSION.split('.');
    var configVersion = this.config.version.split('.');
    this.status.valid = appVersion[0] == configVersion[0] && appVersion[1] == configVersion[1];
  }

  fromFiles() {
    var files = [
      'kernel',
      'simulation',
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
