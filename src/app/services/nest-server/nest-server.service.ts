import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class NestServerService {
  public status: any = {
    server: {
      response: false,
      ready: false,
      valid: false,
    },
    simulator: {
      ready: false,
      valid: false,
    }
  };

  constructor(
    private http: HttpClient,
  ) { }

  check(url) {
    // console.log('Check')
    this.http.get(url)
      .pipe(
        timeout(1000), catchError(e => {
          this.status.server.response = true;
          return of(e);
        })
      )
      .subscribe(res => {
        this.status.server.response = true;
        var appVersion = environment.VERSION.split('.');
        if ('server' in res) {
          this.status.server.ready = true;
          this.status.server['version'] = res['server']['version'];
          var serverVersion = this.status.server['version'].split('.');
          this.status.server.valid = appVersion[0] == serverVersion[0] && appVersion[1] == serverVersion[1];
        }
        if ('simulator' in res) {
          this.status.simulator.ready = true;
          this.status.simulator['version'] = res['simulator']['version'];
          var simulatorVersion = this.status.server['version'].split('.');
          this.status.simulator.valid = appVersion[0] == simulatorVersion[0];
        }
      })
  }
}
