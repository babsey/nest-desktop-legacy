import { Injectable } from '@angular/core';

import { MathService } from '../math/math.service';


@Injectable({
  providedIn: 'root'
})
export class GeneratorService {
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
  }
  private _inputs: any = {
    fill: ['value', 'size'],
    range: ['start', 'end', 'step'],
    linspace: ['start', 'end', 'size'],
    randomUniformInt: ['min', 'max', 'size'],
    randomUniformFloat: ['min', 'max', 'size'],
    randomNormal: ['mu', 'sigma', 'size'],
  }

  constructor(
    private _mathService: MathService,
  ) { }

  get options(): any {
    return this._options;
  }

  view(param: string): boolean {
    return this._inputs[this._options.type].includes(param)
  }

  generate(d: any): number[] {
    let array: number[];
    if (d.type === 'fill') {
      array = this._mathService.fill(parseFloat(d.value), parseInt(d.size))
    } else if (d.type === 'range') {
      array = this._mathService.range(parseFloat(d.start), parseFloat(d.end), parseFloat(d.step));
    } else if (d.type === 'linspace') {
      array = this._mathService.linspace(parseFloat(d.start), parseFloat(d.end), parseInt(d.size));
      array = array.map((a: any) => (d.toFixed === -1 ? parseInt(a) : parseFloat(a.toFixed(d.toFixed))));
    } else if (d.type === 'randomUniformInt') {
      array = this._mathService.randomUniformInt(parseFloat(d.min), parseFloat(d.max), parseInt(d.size));
    } else if (d.type === 'randomUniformFloat') {
      array = this._mathService.randomUniformFloat(parseFloat(d.min), parseFloat(d.max), parseInt(d.size));
      array = array.map((a: any) => (d.toFixed === -1 ? parseInt(a) : parseFloat(a.toFixed(d.toFixed))));
    } else if (d.type === 'randomNormal') {
      array = this._mathService.randomNormal(parseFloat(d.mu), parseFloat(d.sigma), parseInt(d.size));
      array = array.map((a: any) => (d.toFixed === -1 ? parseInt(a) : parseFloat(a.toFixed(d.toFixed))));
    }
    if (d.sort) {
      array.sort((a: number, b: number) => (a - b))
    }
    return array
  }
}
