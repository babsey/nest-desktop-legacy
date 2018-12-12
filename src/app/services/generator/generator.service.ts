import { Injectable } from '@angular/core';

import { MathService } from '../math/math.service';


@Injectable({
  providedIn: 'root'
})
export class GeneratorService {
  public options: any = {
    type: 'range',
    start: 0,
    end: -1,
    min: 0,
    max: -1,
    mu: 0,
    sigma: 1,
    step: 1,
    size: 1,
    sort: true,
  }

  constructor(
    private _mathService: MathService,
  ) {}

  generate(d) {
    var array: any[];
    if (d.type == 'range') {
      array = this._mathService.range(parseFloat(d.start), parseFloat(d.end), parseFloat(d.step));
    } else if (d.type == 'linspace') {
      array = this._mathService.linspace(parseFloat(d.start), parseFloat(d.end), parseInt(d.size));
      array = array.map(a => (d.toFixed == -1 ? parseInt(a) : parseFloat(a.toFixed(d.toFixed))));
    } else if (d.type == 'randomUniformInt') {
      array = this._mathService.randomUniformInt(parseFloat(d.min), parseFloat(d.max), parseInt(d.size));
    } else if (d.type == 'randomUniformFloat') {
      array = this._mathService.randomUniformFloat(parseFloat(d.min), parseFloat(d.max), parseInt(d.size));
      array = array.map(a => (d.toFixed == -1 ? parseInt(a) : parseFloat(a.toFixed(d.toFixed))));
    } else if (d.type == 'randomNormal') {
      array = this._mathService.randomNormal(parseFloat(d.mu), parseFloat(d.sigma), parseInt(d.size));
      array = array.map(a => (d.toFixed == -1 ? parseInt(a) : parseFloat(a.toFixed(d.toFixed))));
    }
    if (d.sort) {
      array.sort((a, b) => (a - b))
    }
    return array
  }
}
