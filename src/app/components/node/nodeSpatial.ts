import * as math from 'mathjs';

import { Config } from '../config';
import { Node } from './node';


export class FreePositions {
  spatial: NodeSpatial;
  values: number[][] = [];

  // arguments for nest.spatial.FreePositions
  pos: any;
  center: number[];               // FreePositions has no argument for center in NEST 3.
  extent: number[];
  edgeWrap: boolean;
  numDimensions: number[];

  constructor(spatial: NodeSpatial, positions: any = {}) {
    this.spatial = spatial;
    this.pos = positions.pos;
    this.center = positions.center || [0, 0];
    this.extent = positions.extent || [1, 1];
    this.edgeWrap = positions.edgeWrap || false;
    this.numDimensions = positions.numDimensions || 2;
  }

  round(value: number): number {
    return Math.floor(value * 100) / 100;
  }

  generate(): void {
    const minX: number = -1 * this.extent[0] / 2,
      maxX: number = this.extent[0] / 2,
      minY: number = -1 * this.extent[1] / 2,
      maxY: number = this.extent[1] / 2;
    // console.log(center,extent,minX,maxX,minY,maxY,length)

    this.values = Array.from({ length: this.spatial.node.size }, () => {
      const x: number = math.random(minX, maxX);
      const y: number = math.random(minY, maxY);
      return [this.round(x), this.round(y)];
    });
  }

  serialize(to: string): any {
    const positions: any = {
      center: this.center,
      extent: this.extent,
    }
    if (to === 'simulator') {
      positions['positions'] = this.pos;
      positions['edge_wrap'] = this.edgeWrap;
      positions['num_dimensions'] = this.numDimensions;
    } else {
      positions['pos'] = this.pos;
      positions['edgeWrap'] = this.edgeWrap;
      positions['numDimensions'] = this.numDimensions;
    }
    return positions;
  }

}


export class GridPositions {
  spatial: NodeSpatial;
  values: number[][];

  // arguments for nest.spatial.GridPositions
  shape: number[];
  center: number[];
  extent: number[];
  edgeWrap: boolean;

  constructor(spatial: NodeSpatial, positions: any = {}) {
    this.spatial = spatial;
    this.shape = positions.shape || [1, 1];
    this.center = positions.center || [0, 0];
    this.extent = positions.extent || [1, 1];
    this.edgeWrap = positions.edgeWrap || false;
  }

  get rows(): number {
    return this.shape[0];
  }

  set rows(value: number) {
    this.shape[0] = value;
  }

  get columns(): number {
    return this.shape[1];
  }

  set columns(value: number) {
    this.shape[1] = value;
  }

  round(value: number): number {
    return Math.floor(value * 100) / 100;
  }

  range(min: number, max: number, size: number): number[] {
    const step: number = (max - min) / size / 2;
    return math.range(min, max, step)['_data'].filter((v, i) => i % 2 == 1)
  }

  generate(): void {
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
      center: this.center,
      extent: this.extent,
    }
    if (to === 'simulator') {
      positions['rows'] = this.rows;
      positions['columns'] = this.columns;
      positions['edge_wrap'] = this.edgeWrap;
    } else {
      positions['shape'] = this.shape;
      positions['edgeWrap'] = this.edgeWrap;
    }
    return positions;
  }

}


export class NodeSpatial {
  node: Node;
  config: Config;
  positions: FreePositions | GridPositions;

  constructor(node: Node, spatial: any = {}) {
    this.node = node;
    this.config = new Config(this.constructor.name);
    this.initPositions(spatial);
  }

  initPositions(spatial: any) {
    this.positions = undefined;
    if (Object.keys(spatial).length > 0) {
      if (spatial.hasOwnProperty('pos')) {
        this.positions = new FreePositions(this, spatial);
      } else if (spatial.hasOwnProperty('shape')) {
        this.positions = new GridPositions(this, spatial);
      }
    }
    if (this.hasPositions()) {
      this.positions.generate();
    }
  }

  hasPositions(): boolean {
    return this.positions !== undefined;
  }

  serialize(to): any {
    return this.positions.serialize(to);
  }

}
