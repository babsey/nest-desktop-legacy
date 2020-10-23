import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatService {

  constructor() {
  }

  format(val: any): any {
    if (Number.isInteger(val)) {
      return parseFloat(val).toFixed(1);
    } else if (Array.isArray(val)) {
      return `[${String(val.map((v: any) => this.format(v)))}]`;
    } else {
      return val;
    }
  }

}
