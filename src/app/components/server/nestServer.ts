import { Config } from '../config';
import { HttpClient } from './httpClient';

import { environment } from '../../../environments/environment';


export class NESTServer extends Config {
  private _http: HttpClient;
  private _state: any = {
    serverReady: false,
    serverValid: false,
    serverVersion: '',
    simulatorReady: false,
    simulatorValid: false,
    simulatorVersion: '',
  };

  constructor() {
    super('NESTServer');
    this._http = new HttpClient();
    this.check();
  }

  get host(): string {
    return this.hostname + (this.port ? ':' + this.port : '');
  }

  set host(value: string) {
    const values: string[] = value.split(':');
    this.hostname = values[0];
    this.port = values[1];
  }

  get hostname(): string {
    return this.config.hostname || window.location.hostname || 'localhost';
  }

  set hostname(value: string) {
    this.updateConfig({ hostname: value });
  }

  get http(): HttpClient {
    return this._http;
  }

  get port(): string {
    return this.config.port;
  }

  set port(value: string) {
    this.updateConfig({ port: value });
  }

  get protocol(): string {
    return this.config.protocol || window.location.protocol;
  }

  set protocol(value: string) {
    this.updateConfig({ protocol: value });
  }

  get state(): any {
    return this._state;
  }

  get url(): string {
    return this.protocol + '//' + this.host;
  }

  set url(value: string) {
    const values: string[] = value.split('//');
    this.protocol = values[0];
    this.host = values[1];
  }

  check(): void {
    // console.log('Check server')
    if (this.config.hostname) {
      const start: any = new Date().getTime();
      this.http.get(this.url)
        .then((resp: any) => {
          const end: any = new Date().getTime();
          const duration: any = end - start;
          // console.log('Pong responds in ' + duration + ' ms')
          this.oidcLoginFailed(resp);
          this.checkVersion(resp);
        })
        .catch((error: any) => {
          console.log(error);
          // this.seek()
          this.oidcLoginFailed(error);
        });
    } else {
      this.seek();
    }
  }

  seek(): void {
    const protocol: string = window.location.protocol;
    const hostname: string = window.location.hostname || 'localhost';
    const hosts: string[] = [
      'server.' + hostname,
      hostname + '/server',
      hostname + ':' + (this.port || '5000'),
    ];
    const hostPromises: any[] = hosts.map((host: string) =>
      new Promise((resolve, reject) => {
        const url: string = protocol + '//' + host;
        this.http.get(url)
          .then((resp: any) => {
            this.url = url;
            this.checkVersion(resp);
            resolve();
          })
          .catch((err: any) => {
            console.log(err);
            resolve();
          });
      })
    );
    Promise.all(hostPromises);
  }

  checkVersion(info: any): void {
    if (info === undefined) { return; }
    // console.log('Fetch info', info)
    const appVersion: string[] = environment.VERSION.split('.');

    if (info.hasOwnProperty('server')) {
      this._state.serverReady = true;
      this._state.serverVersion = info.server.version;
      const serverVersion: string[] = this._state.serverVersion.split('.');
      this._state.serverValid = appVersion[0] === serverVersion[0] && appVersion[1] === serverVersion[1];
    }

    if (info.hasOwnProperty('simulator')) {
      this._state.simulatorReady = true;
      this._state.simulatorVersion = info.simulator.version;
      const simulatorVersion: string[] = this._state.simulatorVersion.split('.');
      if (simulatorVersion.length === 3) {
        this._state.simulatorValid = simulatorVersion[0] === '2' && simulatorVersion[1] >= '18';
      }
    }
  }

  // TODO: not a permament solution
  oidcLoginFailed(resp: any): void {
    if (resp.ok === false && resp.url === 'https://services.humanbrainproject.eu/oidc/login') {
      window.location.reload();
    }
  }

}
