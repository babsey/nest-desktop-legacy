import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatService {

  constructor() { }

  format(val) {
    if (Number.isInteger(val)) {
      return parseFloat(val).toFixed(1)
    } else if (Array.isArray(val)) {
      return '[' + String(val.map(v => this.format(v))) + ']'
    } else {
      return val
    }
  }

}
