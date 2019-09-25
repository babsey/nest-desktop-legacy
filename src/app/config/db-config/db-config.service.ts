import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

var STORAGE_NAME = 'db-config';


@Injectable({
  providedIn: 'root'
})
export class DBConfigService {
  public config: any = {};
  public status: any = {
    ready: false,
    valid: false,
  };
  private version: string;

  constructor(
    private http: HttpClient,
  ) { }

  init(version = null) {
    this.version = version || this.version;
    this.status.ready = false;
    var configJSON = localStorage.getItem(STORAGE_NAME);
    if (configJSON) {
      this.config = JSON.parse(configJSON);
      this.isVersionValid()
    } else {
      this.load()
    }
  }

  list() {
    return Object.keys(this.config).filter(key => key != 'version').map(key => this.config[key])
  }

  load() {
    this.http.get('/assets/config/app/db.json').subscribe(config => {
      this.config = config;
      this.config['version'] = this.version;
      this.save()
      this.isVersionValid()
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

  isVersionValid() {
    var appVersion = this.version.split('.');
    var configVersion = this.config.version.split('.');
    this.status.valid = appVersion[0] == configVersion[0] && appVersion[1] == configVersion[1];
    this.status.ready = true;
  }

}
