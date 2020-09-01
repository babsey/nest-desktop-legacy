import { Config } from '../config'
import { HttpClient } from './httpClient';

import { environment } from '../../../environments/environment';


export class NESTServer extends Config {
  public http: HttpClient;

  public serverReady: boolean = false;
  public serverVersion: string = '';
  public serverValid: boolean = false;

  public simulatorReady: boolean = false;
  public simulatorVersion: string = '';
  public simulatorValid: boolean = false;


  constructor() {
    super('NESTServer');
    this.http = new HttpClient();
    this.check();
  }

  get protocol(): string {
    return this.config.protocol || window.location.protocol;
  }

  set protocol(value: string) {
    this.config = { protocol: value };
  }

  get hostname(): string {
    return this.config.hostname || window.location.hostname || 'localhost';
  }

  set hostname(value: string) {
    this.config = { hostname: value };
  }

  get port(): string {
    return this.config.port;
  }

  set port(value: string) {
    this.config = { port: value };
  }

  get host(): string {
    return this.hostname + (this.port ? ':' + this.port : '');
  }

  set host(value: string) {
    const values: string[] = value.split(':');
    this.hostname = values[0];
    this.port = values[1];
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
        .then(resp => {
          const end: any = new Date().getTime();
          const duration: any = end - start;
          console.log('Pong responds in ' + duration + ' ms')
          this.oidcLoginFailed(resp)
          this.checkVersion(JSON.parse(resp['response']))
        })
        .catch(error => {
          console.log(error)
          // this.seek()
          this.oidcLoginFailed(error)
        })
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
    const hostPromises: any[] = hosts.map(host =>
      new Promise((resolve, reject) => {
        const url: string = protocol + '//' + host;
        this.http.get(url)
          .then(resp => {
            this.url = url;
            this.checkVersion(resp['body']);
            resolve(true);
          })
          .catch(error => console.log(error))
      })
    )
    Promise.all(hostPromises);
  }

  checkVersion(info): void {
    if (info === undefined) return
    // console.log('Fetch info', info)
    const appVersion: string[] = environment.VERSION.split('.');

    if (info.hasOwnProperty('server')) {
      this.serverReady = true;
      this.serverVersion = info['server']['version'];
      const serverVersion: string[] = this.serverVersion.split('.');
      this.serverValid = appVersion[0] === serverVersion[0] && appVersion[1] === serverVersion[1];
    }

    if (info.hasOwnProperty('simulator')) {
      this.simulatorReady = true;
      this.simulatorVersion = info['simulator']['version'];
      const simulatorVersion: string[] = this.simulatorVersion.split('.');
      if (simulatorVersion.length === 3) {
        this.simulatorValid = simulatorVersion[0] === '2' && simulatorVersion[1] >= '18';
      }
    }
  }

  // TODO: not a permament solution
  oidcLoginFailed(resp): void {
    if (resp['ok'] === false && resp['url'] === "https://services.humanbrainproject.eu/oidc/login") {
      window.location.reload();
    }
  }

}
