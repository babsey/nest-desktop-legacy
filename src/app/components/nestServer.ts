import * as http from './http';
import { Config } from './config'

import { environment } from '../../environments/environment';


export class NESTServer {
  config: Config;

  serverReady: boolean = false;
  serverVersion: string = '';
  serverValid: boolean = false;

  simulatorReady: boolean = false;
  simulatorVersion: string = '';
  simulatorValid: boolean = false;

  constructor() {
    this.config = new Config(this.constructor.name);
    this.check();
  }

  get protocol(): string {
    return this.config.data.protocol || window.location.protocol;
  }

  set protocol(value: string) {
    this.config.update({
      protocol: value,
    })
  }

  get hostname(): string {
    return this.config.data.hostname || window.location.hostname || 'localhost';
  }

  set hostname(value: string) {
    this.config.update({
      hostname: value,
    })
  }

  get port(): string {
    return this.config.data.port;
  }

  set port(value: string) {
    this.config.update({
      port: value,
    })
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

  ping(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const start: any = new Date().getTime();
      const xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.open("GET", url, /*async*/true);
      xhr.setRequestHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, content-type');
      xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET');
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 1) {
          // console.log('Request started.');
        }

        if (xhr.readyState === 2) {
          // console.log('Headers received.');
        }

        if (xhr.readyState === 3) {
          // console.log('Data loading..!');
        }

        if (xhr.readyState === 4) {
          // console.log('Request ended.');
          const end: any = new Date().getTime();
          const duration: any = end - start;
          xhr['duration'] = duration;
          resolve(xhr);
        }
      };

      // xhr.addEventListener("progress", event => console.log("progress", event));
      // xhr.addEventListener("load", event => console.log("lead", event));
      // xhr.addEventListener("error", event => console.log("error", event));
      // xhr.addEventListener("abort", event => console.log("abort", event));

      try {
        xhr.send(null);
      } catch (exception) {
        console.log(exception)
        // this is expected
      }
      setTimeout(() => reject(Error('Timeout')), 500);
    })
  }

  check(): void {
    // console.log('Check server')
    if (this.config.data.hostname) {
      this.ping(this.url)
        .then(resp => {
          console.log('Pong responds in ' + resp.duration + ' ms')
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
        this.ping(url)
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

  oidcLoginFailed(resp): void {
    if (resp['ok'] === false && resp['url'] === "https://services.humanbrainproject.eu/oidc/login") {
      window.location.reload()  // TODO: not a permament solution
    }
  }


}
