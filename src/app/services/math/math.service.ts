import { Injectable } from '@angular/core';

import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class MathService {

  constructor() { }

  fill(value, size) {
    return Array.from({ length: size }, () => value);
  }

  range(start, end = null, step = null) {
    if (!end) {
      return Array.from({ length: start }, (val, index) => index);
    } if (!step) {
      return Array.from({ length: end - start }, (val, index) => start + index);
    } else {
      return Array.from({ length: Math.ceil((end - start) / step) }, (val, index) => start + (index * step));
    }
  }

  linspace(start, end, size) {
    var step = (end - start) / (size - 1);
    return this.range(start, end + step, step)
  }

  randomInt(min, max) {
    var range = max - min + 1;
    return Math.floor(Math.random() * range) + min;
  }

  randomUniformInt(start, end, size) {
    return Array.from({ length: size }, () => this.randomInt(start, end));
  }

  randomUniformFloat(min, max, size) {
    return Array.from({ length: size }, () => d3.randomUniform(min, max)());
  }

  randomNormal(mu, sigma, size) {
    return Array.from({ length: size }, () => d3.randomNormal(mu, sigma)());
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
}
