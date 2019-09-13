import { Injectable } from '@angular/core';

import * as math from 'mathjs';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  constructor() { }

  range(min, max, size) {
    var step = (max - min) / size / 2;
    return math.range(min, max, step)['_data'].filter((v, i) => i % 2 == 1)
  }

  round(val) {
    return Math.floor(val * 100) / 100;
  }

  freePositions(collection) {
    var center = collection.spatial.center || [0, 0];
    var extent = collection.spatial.extent || [1, 1];
    var minX = center[0] - extent[0] / 2;
    var maxX = center[0] + extent[0] / 2;
    var minY = center[1] - extent[1] / 2;
    var maxY = center[1] + extent[1] / 2;
    var length = collection.n || 1;
    // console.log(center,extent,minX,maxX,minY,maxY,length)

    var positions = Array.from({ length: length }, () => {
      var x = math.random(minX, maxX);
      var y = math.random(minY, maxY);
      return [this.round(x), this.round(y)];
    });
    return positions;
  }

  gridPositions(collection) {
    var center = collection.spatial.center || [0, 0];
    var extent = collection.spatial.extent || [1, 1];
    var minX = center[0] - extent[0] / 2;
    var maxX = center[0] + extent[0] / 2;
    var minY = center[1] - extent[1] / 2;
    var maxY = center[1] + extent[1] / 2;
    var rows = collection.spatial['rows'] || 1;
    var columns = collection.spatial['columns'] || 1;
    // console.log(center,extent,minX,maxX,minY,maxY,rows,columns)

    var X = this.range(minX, maxX, rows);
    var Y = this.range(minY, maxY, columns);
    var positions = [];
    X.forEach(x => Y.forEach(y => positions.push([this.round(x), this.round(y)])))
    return positions;
  }
}
