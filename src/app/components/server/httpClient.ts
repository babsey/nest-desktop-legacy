export class HttpClient {
  public oReq: XMLHttpRequest;

  constructor() {
  }

  abort(): void {
    this.oReq.abort();
  }

  get(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.oReq = new XMLHttpRequest();
      this.oReq.open("GET", url, /*async*/true);
      this.oReq.setRequestHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, content-type');
      this.oReq.setRequestHeader('Access-Control-Allow-Origin', '*');
      this.oReq.setRequestHeader('Content-Type', 'application/json');
      this.oReq.setRequestHeader('Access-Control-Allow-Methods', 'GET');
      this.oReq.onreadystatechange = () => {
        if (this.oReq.readyState === 1) {
          // console.log('Request started.');
        }

        if (this.oReq.readyState === 2) {
          // console.log('Headers received.');
        }

        if (this.oReq.readyState === 3) {
          // console.log('Data loading..!');
        }

        if (this.oReq.readyState === 4) {
          // console.log('Request ended.');
          resolve(this.oReq)
        }
      };

      // this.oReq.addEventListener("progress", event => console.log("progress", event));
      // this.oReq.addEventListener("load", event => console.log("lead", event));
      // this.oReq.addEventListener("error", event => console.log("error", event));
      // this.oReq.addEventListener("abort", event => console.log("abort", event));

      try {
        this.oReq.send(null);
      } catch (exception) {
        console.log(exception)
        // this is expected
        reject(this.oReq)
      }
    })
  }

  post(url: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.oReq = new XMLHttpRequest();
      this.oReq.open("POST", url, /*async*/true);
      this.oReq.setRequestHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, content-type');
      this.oReq.setRequestHeader('Access-Control-Allow-Origin', '*');
      this.oReq.setRequestHeader('Content-Type', 'application/json');
      this.oReq.setRequestHeader('Access-Control-Allow-Methods', 'POST');
      this.oReq.timeout = 10000
      this.oReq.responseType = 'json';
      this.oReq.onreadystatechange = () => {
        if (this.oReq.readyState === 1) {
          // console.log('Request started.');
        }

        if (this.oReq.readyState === 2) {
          // console.log('Headers received.');
        }

        if (this.oReq.readyState === 3) {
          // console.log('Data loading..!');
        }

        if (this.oReq.readyState === 4) {
          // console.log('Request ended.');
          resolve(this.oReq);
        }
      };

      // this.oReq.addEventListener("progress", event => console.log("progress", event));
      // this.oReq.addEventListener("load", event => console.log("lead", event));
      // this.oReq.addEventListener("error", event => console.log("error", event));
      // this.oReq.addEventListener("abort", event => console.log("abort", event));

      try {
        this.oReq.send(data);
      } catch (exception) {
        console.log(exception)
        // this is expected
        reject(Error('Error'))
      }
    })
  }

}
