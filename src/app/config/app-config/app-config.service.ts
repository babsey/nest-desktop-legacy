import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

var STORAGE_NAME = 'app-config';


@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  public config: any = {
    app: {
      showLoading: false
    }
  };
  public status: any = {
    ready: false,
    valid: false
  };
  private version: string;

  constructor(
    private http: HttpClient,
  ) {
  }

  init(version = null) {
    this.version = version || this.version;
    this.status.ready = false;
    let configJSON = localStorage.getItem(STORAGE_NAME);
    if (configJSON) {
      this.config = JSON.parse(configJSON);
      this.isVersionValid()
    } else {
      this.load()
    }
  }

  load() {
    this.http.get('/assets/config/app/app.json').subscribe(config => {
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

  urlRoot() {
    var server = this.config['nest-server'];
    var host = server['host'] || window.location.host.split(':')[0] || 'localhost';
    var url = 'http://' + host;
    if (server['port']) {
      url = url + ':' + server['port'];
    }
    return url;
  }

}
