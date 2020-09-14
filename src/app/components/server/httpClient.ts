export class HttpClient {
  private _oReq: XMLHttpRequest;

  constructor() {
  }

  abort(): void {
    this._oReq.abort();
  }

  get(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._oReq = new XMLHttpRequest();
      this._oReq.open('GET', url, /*async*/true);
      this._oReq.setRequestHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, content-type');
      this._oReq.setRequestHeader('Access-Control-Allow-Origin', '*');
      this._oReq.setRequestHeader('Content-Type', 'application/json');
      this._oReq.setRequestHeader('Access-Control-Allow-Methods', 'GET');
      this._oReq.onreadystatechange = () => {
        if (this._oReq.readyState === 1) {
          // console.log('Request started.');
        }

        if (this._oReq.readyState === 2) {
          // console.log('Headers received.');
        }

        if (this._oReq.readyState === 3) {
          // console.log('Data loading..!');
        }

        if (this._oReq.readyState === 4) {
          // console.log('Request ended.');
          resolve(this._oReq);
        }
      };

      // this._oReq.addEventListener('progress', event => console.log('progress', event));
      // this._oReq.addEventListener('load', event => console.log('lead', event));
      // this._oReq.addEventListener('error', event => console.log('error', event));
      // this._oReq.addEventListener('abort', event => console.log('abort', event));

      try {
        this._oReq.send(null);
      } catch (exception) {
        console.log(exception);
        // this is expected
        reject(this._oReq);
      }
    });
  }

  post(url: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._oReq = new XMLHttpRequest();
      this._oReq.open('POST', url, /*async*/true);
      this._oReq.setRequestHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, content-type');
      this._oReq.setRequestHeader('Access-Control-Allow-Origin', '*');
      this._oReq.setRequestHeader('Content-Type', 'application/json');
      this._oReq.setRequestHeader('Access-Control-Allow-Methods', 'POST');
      this._oReq.timeout = 10000;
      this._oReq.responseType = 'json';
      this._oReq.onreadystatechange = () => {
        if (this._oReq.readyState === 1) {
          // console.log('Request started.');
        }

        if (this._oReq.readyState === 2) {
          // console.log('Headers received.');
        }

        if (this._oReq.readyState === 3) {
          // console.log('Data loading..!');
        }

        if (this._oReq.readyState === 4) {
          // console.log('Request ended.');
          resolve(this._oReq);
        }
      };

      // this._oReq.addEventListener('progress', event => console.log('progress', event));
      // this._oReq.addEventListener('load', event => console.log('lead', event));
      // this._oReq.addEventListener('error', event => console.log('error', event));
      // this._oReq.addEventListener('abort', event => console.log('abort', event));

      try {
        this._oReq.send(data);
      } catch (exception) {
        console.log(exception);
        // this is expected
        reject(Error('Error'));
      }
    });
  }

}
