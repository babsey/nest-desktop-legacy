import { Injectable } from '@angular/core';

import * as math from 'mathjs';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  constructor() { }

  range(min: number, max: number, size: number): number[] {
    var step = (max - min) / size / 2;
    return math.range(min, max, step)['_data'].filter((v, i) => i % 2 == 1)
  }

  round(val: number): number {
    return Math.floor(val * 100) / 100;
  }

  freePositions(size: number = 1, spatial: any): number[][] {
    var center = spatial['center'] || [0, 0];
    var extent = spatial['extent'] || [1, 1];
    var minX = center[0] - extent[0] / 2;
    var maxX = center[0] + extent[0] / 2;
    var minY = center[1] - extent[1] / 2;
    var maxY = center[1] + extent[1] / 2;
    // console.log(center,extent,minX,maxX,minY,maxY,length)

    var positions = Array.from({ length: size }, () => {
      var x = math.random(minX, maxX);
      var y = math.random(minY, maxY);
      return [this.round(x), this.round(y)];
    });
    return positions;
  }

  gridPositions(spatial: any): number[][] {
    var center = spatial['center'] || [0, 0];
    var extent = spatial['extent'] || [1, 1];
    var minX = center[0] - extent[0] / 2;
    var maxX = center[0] + extent[0] / 2;
    var minY = center[1] - extent[1] / 2;
    var maxY = center[1] + extent[1] / 2;
    var rows = spatial['rows'] || 1;
    var columns = spatial['columns'] || 1;
    // console.log(center,extent,minX,maxX,minY,maxY,rows,columns)

    var X = this.range(minX, maxX, rows);
    var Y = this.range(minY, maxY, columns);
    var positions = [];
    X.forEach(x => Y.forEach(y => positions.push([this.round(x), this.round(y)])))
    return positions;
  }
}
