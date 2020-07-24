import { Config } from './config';
import { Node } from './node';

import * as math from 'mathjs';


export class FreePositions {
  // arguments for nest.spatial.FreePositions
  pos: any;
  extent: number[];
  edgeWrap: boolean;
  numDimensions: number[];
  values: number[][] = [];

  constructor(positions: any = {}) {
    this.pos = positions.pos;
    this.extent = positions.extent || [1, 1];
    this.edgeWrap = positions.edgeWrap || false;
    this.numDimensions = positions.numDimensions || 2;
  }

  round(value: number): number {
    return Math.floor(value * 100) / 100;
  }

  generatePositions(node: Node): void {
    const minX: number = -1 * this.extent[0] / 2,
      maxX: number = this.extent[0] / 2,
      minY: number = -1 * this.extent[1] / 2,
      maxY: number = this.extent[1] / 2;
    // console.log(center,extent,minX,maxX,minY,maxY,length)

    this.values = Array.from({ length: node.size }, () => {
      const x: number = math.random(minX, maxX);
      const y: number = math.random(minY, maxY);
      return [this.round(x), this.round(y)];
    });
  }

  serialize(to: string): any {
    const positions: any = {
      pos: this.pos,
      extent: this.extent,
    }
    if (to === 'simulator') {
      positions['edge_wrap'] = this.edgeWrap;
      positions['num_dimensions'] = this.numDimensions;
    } else {
      positions['edgeWrap'] = this.edgeWrap;
      positions['numDimensions'] = this.numDimensions;
    }
    return positions;
  }

}


export class GridPositions {
  // arguments for nest.spatial.GridPositions
  shape: number[];
  center?: number;
  extent?: number[];
  edgeWrap?: boolean;
  values?: number[][];

  constructor(positions: any = {}) {
    this.shape = positions.shape || [1, 1];
    this.center = positions.center || [0, 0];
    this.extent = positions.extent || [1, 1];
    this.edgeWrap = positions.edgeWrap || false;
  }

  round(value: number): number {
    return Math.floor(value * 100) / 100;
  }

  range(min: number, max: number, size: number): number[] {
    const step: number = (max - min) / size / 2;
    return math.range(min, max, step)['_data'].filter((v, i) => i % 2 == 1)
  }

  generatePositions(node: Node): void {
    const minX: number = this.center[0] - this.extent[0] / 2,
      maxX: number = this.center[0] + this.extent[0] / 2,
      minY: number = this.center[1] - this.extent[1] / 2,
      maxY: number = this.center[1] + this.extent[1] / 2;

    // console.log(center,extent,minX,maxX,minY,maxY,rows,columns)

    const X: number[] = this.range(minX, maxX, this.shape[0]);
    const Y: number[] = this.range(minY, maxY, this.shape[1]);
    this.values = [];
    X.forEach(x => Y.forEach(y => this.values.push([this.round(x), this.round(y)])))
  }

  serialize(to): any {
    const positions: any = {
      shape: this.shape,
      center: this.center,
      extent: this.extent,
    }
    if (to === 'simulator') {
      positions['edge_wrap'] = this.edgeWrap;
    } else {
      positions['edgeWrap'] = this.edgeWrap;
    }
    return positions;
  }

}


export class Spatial {
  node: Node;
  config: Config;
  isSpatial: boolean = false;
  positions: FreePositions | GridPositions;

  constructor(node: Node, spatial: any = {}) {
    this.node = node;
    this.config = new Config(this);
    if (Object.keys(spatial).length > 0) {
      this.positions = spatial.hasOwnProperty('pos') ? new FreePositions(spatial) : new GridPositions(spatial);
    }
  }

  serialize(to): any {
    const positions: any = this.positions.serialize(to);
    return positions;
  }

}
