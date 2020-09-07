// https://www.probabilitycourse.com
import { Injectable } from '@angular/core';

import * as math from 'mathjs';

@Injectable({
  providedIn: 'root'
})
export class DistributionService {
  private _pdf: any;

  constructor() {
    this._pdf = {
      linear: this.linear,
      exponential: this.exponential,
      gaussian: this.gaussian,
      gaussian2D: this.gaussian2D,
      gamma: this.gamma,
      uniform: this.uniform,
      normal: this.normal,
      lognormal: this.lognormal,
    };
  }

  get pdf(): any {
    return this._pdf;
  }

  linear(xarr: number[], specs: any): number[] {
    var y: number;
    return xarr.map(x => {
      y = (x > 0) ? specs.c + specs.a * x : 0;
      return y > 0 ? y : 0;
    })
  }

  exponential(xarr: number[], specs: any): number[] {
    var y: number;
    return xarr.map(x => {
      y = (x > 0) ? specs.c + specs.a * math.exp(-1 * x / specs.tau) : 0;
      return y > 0 ? y : 0;
    })
  }

  gaussian(xarr: number[], specs: any): number[] {
    var y: number;
    return xarr.map(x => {
      y = specs.c + specs.p_center * math.exp(-1 * Number(math.pow(x - specs.mean, 2)) / (2 * Number(math.pow(specs.sigma, 2))));
      return (y > 0) ? y : 0;
    })
  }

  gaussian2D(xarr: number[], yarr: number[], specs: any): number[][] {
    var z: number;
    return yarr.map(y => {
      return xarr.map(x => {
        z = specs.c + specs.p_center * math.exp(-1 * (Number(math.pow((x - specs.mean_x), 2)) / Number(math.pow(specs.sigma_x, 2)) + Number(math.pow((y - specs.mean_y), 2)) / Number(math.pow(specs.sigma_y, 2)) + 2 * specs.rho * (x - specs.mean_x) * (y - specs.mean_y) / (specs.sigma_x * specs.sigma_y)) / (2. * (1 - Number(math.pow(specs.rho, 2)))));
        return z;
      })
    })
  }

  gamma(xarr: number[], specs: any): number[] {
    var y: number;
    return xarr.map(x => {
      y = (x > 0) ? Number(math.pow(specs.theta, specs.kappa)) * Number(math.pow(x, specs.kappa - 1)) * math.exp(-1 * specs.theta * x) / Number(math.factorial(specs.kappa - 1)) : 0;
      return (y > 0) ? y : 0;
    })
  }

  uniform(xarr: number[], specs: any): number[] {
    var y: number;
    return xarr.map(x => {
      y = 1 / (specs.max - specs.min);
      return (x >= specs.min && x < specs.max && y > 0) ? y : 0;
    })
  }

  normal(xarr: number[], specs: any): number[] {
    var y: number;
    return xarr.map(x => {
      y = 1 / (specs.sigma * math.sqrt(2 * math.pi)) * math.exp(-1 * Number(math.pow(x - specs.mean, 2)) / (2 * Number(math.pow(specs.sigma, 2))));
      return (x >= specs.min && x < specs.max && y > 0) ? y : 0;
    })
  }

  lognormal(xarr: number[], specs: any): number[] {
    var y: number;
    return xarr.map(x => {
      y = 1 / (x * specs.sigma * math.sqrt(2 * math.pi)) * math.exp(-1 * Number(math.pow(Number(math.log(x)) - specs.mu, 2)) / (2 * Number(math.pow(specs.sigma, 2))));
      return (x >= specs.min && x < specs.max && y > 0) ? y : 0;
    })
  }

}
