import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout, catchError, first } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { NestServerConfigService } from './nest-server-config/nest-server-config.service';

import { environment } from '../../environments/environment';

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
    private _nestServerConfigService: NestServerConfigService,
  ) { }

  init(): void {
    this.status = {
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
  }

  url(): string {
    const config: any = this._nestServerConfigService.config;
    const host: string = config['host'] || window.location.host.split(':')[0] || 'localhost';
    let url: string = (config['secure'] ? 'https://' : 'http://') + host;
    if (config['port']) {
      url += ':' + config['port'];
    }
    return url;
  }

  check(): void {
    // console.log('Check server')
    this.init();
    if (this._nestServerConfigService.config.host) {
      this.ping(this.url()).then(resp => {
        this.oidcLoginFailed(resp)
        this.checkVersion(resp['body'])
      }).catch(error => this.oidcLoginFailed(error))
    } else {
      this.seekServer()
    }
  }

  ping(url) {
    return new Promise((resolve, reject) => {
      this.http.get(url, {
        observe: 'response',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, content-type',
          'Access-Control-Allow-Methods': 'GET',
        }
      }).pipe(first())
        .subscribe(resp => {
          this.status.server.response = true;
          resp.status === 200 ? resolve(resp) : reject(resp)
        }, error => {
          this.status.server.response = true;
          reject(error)
        })
    })
  }

  seekServer(): void {
    const config: any = this._nestServerConfigService.config;
    const protocol: string = window.location.protocol;
    const hostname: string = window.location.hostname || 'localhost';
    const port: string = config['port'] || '5000';
    const hosts = [
      'server.' + hostname,
      hostname + '/server',
      hostname + ':' + port,
    ];
    hosts.forEach(host => {
      const url: string = protocol + '//' + host;
      this.ping(url)
        .then(resp => {
          config['host'] = host.split(':')[0];
          if (host.split(':')[1]) {
            config['port'] = host.split(':')[1];
          }
          config['secure'] = protocol.startsWith('https');
          this._nestServerConfigService.save();
          this.checkVersion(resp['body'])
        })
        .catch(error => { })
    })
  }

  checkVersion(info): void {
    if (info === undefined) return
    // console.log('Fetch info', info)
    var appVersion = environment.VERSION.split('.');
    if (info.hasOwnProperty('server')) {
      this.status.server.ready = true;
      this.status.server['version'] = info['server']['version'];
      var serverVersion = this.status.server['version'].split('.');
      this.status.server.valid = appVersion[0] == serverVersion[0] && appVersion[1] == serverVersion[1];
    }
    if (info.hasOwnProperty('simulator')) {
      this.status.simulator.ready = true;
      this.status.simulator['version'] = info['simulator']['version'];
      var simulatorVersion = this.status.server['version'].split('.');
      this.status.simulator.valid = appVersion[0] == simulatorVersion[0];
    }
  }

  oidcLoginFailed(resp): void {
    if (resp['ok'] == false && resp['url'] == "https://services.humanbrainproject.eu/oidc/login") {
      window.location.reload()  // TODO: not a permament solution
    }
  }

}
