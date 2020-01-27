import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';


var STORAGE_NAME = 'nest-server-config';


@Injectable({
  providedIn: 'root'
})
export class NestServerConfigService {
  public config: any = {
    version: null,
  };
  public status: any = {
    ready: false,
    valid: false,
  };

  constructor(
    private http: HttpClient,
  ) { }

  init(): void {
    this.status.ready = false;
    var configJSON = localStorage.getItem(STORAGE_NAME);
    if (configJSON) {
      this.config = JSON.parse(configJSON);
      this.isValid()
    } else {
      this.load()
    }
  }

  load(): void {
    this.http.get('/assets/config/nest-server/nest-server.json')
      .subscribe(config => {
        this.config = config;
        this.config['version'] = environment.VERSION;
        this.save()
        this.isValid()
    })
  }

  save(): void {
    let configJSON = JSON.stringify(this.config);
    localStorage.setItem(STORAGE_NAME, configJSON);
  }

  reset(): void {
    localStorage.removeItem(STORAGE_NAME)
    this.init()
  }

  isValid(): void {
    var appVersion = environment.VERSION.split('.');
    var configVersion = this.config.version.split('.');
    var versionValid = appVersion[0] == configVersion[0] && appVersion[1] == configVersion[1];
    this.status.valid = versionValid;
    this.status.ready = true;
  }

}
