import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';


var STORAGE_NAME = 'nest-server-config';


@Injectable({
  providedIn: 'root'
})
export class NestServerConfigService {
  public config: any = {};
  public status: any = {
    ready: false,
    valid: false,
  };

  constructor(
    private http: HttpClient,
  ) { }

  init() {
    this.status.ready = false;
    var configJSON = localStorage.getItem(STORAGE_NAME);
    if (configJSON) {
      this.config = JSON.parse(configJSON);
      this.isValid()
    } else {
      this.load()
    }
  }

  load() {
    this.http.get('/assets/config/nest-server/nest-server.json')
      .subscribe(config => {
        this.config = config;
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
    this.status.valid = versionValid;
    this.status.ready = true;
  }

}
