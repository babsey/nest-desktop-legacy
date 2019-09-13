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
        if ('server' in res) {
          this.status.server.ready = true;
          this.status.server['version'] = 'v' + res['server']['version'];
          this.status.server.valid = this.status.server['version'] == environment.VERSION;
        }
        if ('simulator' in res) {
          this.status.simulator.ready = true;
          this.status.simulator['version'] = ((typeof res['simulator']['version'][0] === 'number') ? 'v' : '') + res['simulator']['version'];
          this.status.simulator.valid = true;
        }
      })
  }
}
