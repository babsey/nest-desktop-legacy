import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

var STORAGE_NAME = 'app-config';


@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  public config: any = {};
  public status: any = {
    loading: false,
    ready: false,
    valid: false,
    NEST: {
      server: {
        response: false,
        ready: false,
        valid: false,
      },
      simulator: {
        ready: false,
        valid: false,
      },
    }
  };

  constructor(
    private http: HttpClient,
  ) {
  }

  init() {
    this.status.loading = true;
    this.status.ready = false;
    let configJSON = localStorage.getItem(STORAGE_NAME);
    if (configJSON) {
      this.config = JSON.parse(configJSON);
    } else {
      this.config = require('./app-config.json');
      this.config['version'] = environment.VERSION;
      this.save()
    }
    this.status.ready = true;
    this.status.loading = false;
    this.status.valid = this.config.version == environment.VERSION;
    this.check();
  }

  save() {
    let configJSON = JSON.stringify(this.config);
    localStorage.setItem(STORAGE_NAME, configJSON);
  }

  reset() {
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
          this.status.NEST.server.response = true;
          return of(e);
        })
      )
      .subscribe(res => {
        this.status.NEST.server.response = true;
        if ('server' in res) {
          this.status.NEST.server.ready = true;
          this.status.NEST.server['version'] = res['server']['version'];
          this.status.NEST.server.valid = res['server']['version'] == environment.VERSION;
        }
        if ('simulator' in res) {
          this.status.NEST.simulator.ready = true;
          this.status.NEST.simulator['version'] = res['simulator']['version'];
          this.status.NEST.simulator.valid = res['simulator']['version'] == '2.16.0';
        }
      })
  }

}
