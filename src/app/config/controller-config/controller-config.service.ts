import { Injectable } from '@angular/core';

declare function require(url: string);

var STORAGE_NAME = 'controller-config';


@Injectable({
  providedIn: 'root'
})
export class ControllerConfigService {
  public config: any = {
    level: -1,
    bottomSheetOpened: true,
    showSlider: false,
    showSketch: true,
    version: '1.2.0',
  };
  public ready: boolean;
  public version: string;

  constructor(
  ) {
  }

  init() {
    var configJSON = localStorage.getItem(STORAGE_NAME);
    if (configJSON) {
      this.config = JSON.parse(configJSON);
      this.version = this.config.version;
    } else {
      this.fromFiles()
      this.save()
    }
    this.ready = true;
  }

  fromFiles() {
    var files = [
      'connection',
      'kernel',
      'label',
      'node',
      'receptor',
      'simulation',
    ];
    for (var idx in files) {
      var filename = files[idx];
      var configData = require('./controller-configs/' + filename + '.json');
      this.config[filename] = configData;
    }
  }

  save() {
    let configJSON = JSON.stringify(this.config);
    localStorage.setItem(STORAGE_NAME, configJSON);
  }

}
