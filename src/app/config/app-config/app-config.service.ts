import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

declare function require(url: string);

var STORAGE_NAME = 'app-config';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  public options: any = {
    NEST: {
      running: undefined,
      data: {},
    }
  };
  public config: any = {};
  public ready: boolean;
  public serverVersion: string;
  public nestVersion: string;

  constructor(
    private http: HttpClient,
  ) {
  }

  init() {
    let configJSON = localStorage.getItem(STORAGE_NAME);
    if (configJSON) {
      this.config = JSON.parse(configJSON);
    } else {
      this.config = require('./app-config.json');
      this.save()
    }
    this.ready = true;
    this.check()
  }

  save() {
    let configJSON = JSON.stringify(this.config);
    localStorage.setItem(STORAGE_NAME, configJSON);
  }

  reset() {
    this.ready = false;
    localStorage.removeItem(STORAGE_NAME)
    this.init()
  }

  urlRoot() {
    var nestServer = this.config['nest-server'];
    return 'http://' + nestServer['host'] + ':' + nestServer['port'];
  }

  check() {
    // console.log('Check')
    this.http.get(this.urlRoot())
      .pipe(
        timeout(1000), catchError(e => {
          this.options.NEST.running = false;
          this.options.NEST.request = 'failed';
          return of(e);
        })
      )
      .subscribe(res => {
        this.options.NEST.request = 'ok'
        if ('nest' in res) {
          this.options.NEST.running = true;
          this.options.NEST.data = res;
          this.serverVersion = res['version'];
          this.nestVersion = res['nest']['version'];
        }
      })
  }

}
