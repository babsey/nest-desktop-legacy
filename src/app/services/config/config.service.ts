import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public config: any = {};
  public status: any = {
    ready: false,
    valid: false
  };
  name: string = '';
  files: string[] = [];

  constructor(
    private http: HttpClient,
  ) {
  }

  init(name = null, files = null): void {
    this.name = name || this.name;
    this.files = files || this.files;
    this.status.ready = false;
    let configJSON = localStorage.getItem(this.name);
    if (configJSON) {
      this.config = JSON.parse(configJSON);
      this.checkVersions()
    } else {
      this.load()
    }
  }

  load(): void {
    var url = '/assets/config/' + this.name + '/';
    var configs = this.files.map(file => this.http.get(url + file + '.json'));
    forkJoin(configs).subscribe(configs => {
      this.files.map((file, idx) => {
        this.config[file] = configs[idx]
      })
      this.config['version'] = environment.VERSION;
      this.save()
      this.checkVersions()
    })
  }

  save(): void {
    let configJSON = JSON.stringify(this.config);
    localStorage.setItem(this.name, configJSON);
  }

  checkVersions(): void {
    var appVersion = environment.VERSION.split('.');
    var configVersion = this.config.version.split('.');
    this.status.valid = appVersion[0] == configVersion[0] && appVersion[1] == configVersion[1];
    this.status.ready = true;
  }

  reset(): void {
    localStorage.removeItem(this.name)
    this.init()
  }
}
