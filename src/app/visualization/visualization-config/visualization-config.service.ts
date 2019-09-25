import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

var STORAGE_NAME = 'visualization-config';

@Injectable({
  providedIn: 'root'
})
export class VisualizationConfigService {
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
    this.version = version || this.version
    this.status.ready = false;
    var configJSON = localStorage.getItem(STORAGE_NAME);
    if (configJSON) {
      this.config = JSON.parse(configJSON);
      this.isVersionValid()
    } else {
      this.load()
    }
  }

  load() {
    this.http.get('/assets/config/visualization/chart.json').subscribe(config => {
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

  isVersionValid() {
    var appVersion = this.version.split('.');
    var configVersion = this.config.version.split('.');
    this.status.valid = appVersion[0] == configVersion[0] && appVersion[1] == configVersion[1];
    this.status.ready = true;
  }

  reset() {
    localStorage.removeItem(STORAGE_NAME)
    this.init()
  }

}
