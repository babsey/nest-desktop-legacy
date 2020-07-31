import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { environment } from '../../../environments/environment';

var STORAGE_NAME = 'app-config';


@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  public config: any = {
    app: {
      showLoading: false,
      devMode: false,
    }
  };
  public status: any = {
    ready: false,
    valid: false
  };
  private files: string[] = [
    'app',
    'groups',
    'user',
    'random',
  ];

  constructor(
    private http: HttpClient,
  ) {
  }

  init(): void {
    this.status.ready = false;
    let configJSON = localStorage.getItem(STORAGE_NAME);
    if (configJSON) {
      this.config = JSON.parse(configJSON);
      this.isValid()
    } else {
      this.fromFiles(this.files)
    }
  }

  fromFiles(files: string[]): void {
    var configFiles = files.map(file => this.http.get('/assets/config/app/' + file + '.json'));
    forkJoin(configFiles).subscribe(configs => {
      configs.map((config, idx) => {
        this.config[files[idx]] = config;
      })
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
    var configValid = this.files.filter(file => this.config.hasOwnProperty(file)).length != 0;
    this.status.valid = versionValid && configValid;
    this.status.ready = true;
  }

}
