import { Injectable } from '@angular/core';

import { MathService } from '../math/math.service';


@Injectable({
  providedIn: 'root'
})
export class GeneratorService {
  private _inputs: any = {
    fill: ['value', 'size'],
    range: ['start', 'end', 'step'],
    linspace: ['start', 'end', 'size'],
    randomUniformInt: ['min', 'max', 'size'],
    randomUniformFloat: ['min', 'max', 'size'],
    randomNormal: ['mu', 'sigma', 'size'],
  };
  private _options: any = {
    type: 'fill',
    start: 0,
    end: -1,
    min: 0,
    max: -1,
    mu: 0,
    sigma: 1,
    step: 1,
    size: 1,
    sort: true,
  };

  constructor(
    private _mathService: MathService,
  ) { }

  get options(): any {
    return this._options;
  }

  view(param: string): boolean {
    return this._inputs[this._options.type].includes(param);
  }

  generate(d: any): number[] {
    let array: number[];
    switch (d.type) {
      case 'fill':
        array = this._mathService.fill(parseFloat(d.value), parseInt(d.size, 0));
        break;
      case 'range':
        array = this._mathService.range(parseFloat(d.start), parseFloat(d.end), parseFloat(d.step));
        break;
      case 'linspace':
        array = this._mathService.linspace(parseFloat(d.start), parseFloat(d.end), parseInt(d.size, 0));
        array = array.map((a: any) => (d.toFixed === -1 ? parseInt(a, 0) : parseFloat(a.toFixed(d.toFixed))));
        break;
      case 'randomUniformInt':
        array = this._mathService.randomUniformInt(parseFloat(d.min), parseFloat(d.max), parseInt(d.size, 0));
        break;
      case 'randomUniformFloat':
        array = this._mathService.randomUniformFloat(parseFloat(d.min), parseFloat(d.max), parseInt(d.size, 0));
        array = array.map((a: any) => (d.toFixed === -1 ? parseInt(a, 0) : parseFloat(a.toFixed(d.toFixed))));
        break;
      case 'randomNormal':
        array = this._mathService.randomNormal(parseFloat(d.mu), parseFloat(d.sigma), parseInt(d.size, 0));
        array = array.map((a: any) => (d.toFixed === -1 ? parseInt(a, 0) : parseFloat(a.toFixed(d.toFixed))));
    }
    if (d.sort) {
      array.sort((a: number, b: number) => (a - b));
    }
    return array;
  }
}
