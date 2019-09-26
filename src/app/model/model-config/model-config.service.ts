import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { environment } from '../../../environments/environment';

var STORAGE_NAME = 'model-config';


@Injectable({
  providedIn: 'root'
})
export class ModelConfigService {
  public config: any = {};
  public status: any = {
    ready: false,
    valid: false
  };
  private files: string[] = [
    'db'
  ];

  constructor(
    private http: HttpClient,
  ) {
  }

  init() {
    this.status.ready = false;
    let configJSON = localStorage.getItem(STORAGE_NAME);
    if (configJSON) {
      this.config = JSON.parse(configJSON);
      this.isValid()
    } else {
      this.fromFiles(this.files)
    }
  }

  fromFiles(files) {
    var configFiles = files.map(file => this.http.get('/assets/config/model/' + file + '.json'));
    forkJoin(configFiles).subscribe(configs => {
      configs.map((config, idx) => {
        this.config[files[idx]] = config;
      })
      this.config['version'] = environment.VERSION;
      this.save()
      this.isValid()
    })
  }

  save() {
    let configJSON = JSON.stringify(this.config);
    localStorage.setItem(STORAGE_NAME, configJSON);
  }

  reset() {
    localStorage.removeItem(STORAGE_NAME)
    this.init()
  }

  isValid() {
    var appVersion = environment.VERSION.split('.');
    var configVersion = this.config.version.split('.');
    var versionValid = appVersion[0] == configVersion[0] && appVersion[1] == configVersion[1];
    var configValid = this.files.filter(file => this.config.hasOwnProperty(file)).length != 0;
    this.status.valid = versionValid && configValid;
    this.status.ready = true;
  }

}
