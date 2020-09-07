import * as math from 'mathjs';

import { Config } from '../config';
import { Node } from './node';


export class FreePositions {
  spatial: NodeSpatial;
  values: number[][] = [];
  private _name: string = 'free';

  // arguments for nest.spatial.free
  pos: any;
  center: number[];               // FreePositions has no argument for center in NEST 3.
  extent: number[];
  edgeWrap: boolean;
  numDimensions: number[];

  rows?: number;
  columns?: number;

  constructor(spatial: NodeSpatial, positions: any = {}) {
    this.spatial = spatial;
    this.pos = positions.pos;
    this.center = positions.center || [0, 0];
    this.extent = positions.extent || [1, 1];
    this.edgeWrap = positions.edgeWrap || false;
    this.numDimensions = positions.numDimensions || 2;
  }

  get name(): string {
    return this._name;
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

  toJSON(target: string = 'db'): any {
    const positions: any = {
      center: this.center,
      extent: this.extent,
    }
    if (target === 'simulator') {
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
  private _name: string = 'grid';

  // arguments for nest.spatial.grid
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

  get name(): string {
    return this._name;
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
    return math.range(min, max, step)['_data'].filter((v: number, i: number) => i % 2 === 1)
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
    X.forEach((x: number) => Y.forEach((y: number) => this.values.push([this.round(x), this.round(y)])))
  }

  toJSON(target: string = 'db'): any {
    const positions: any = {
      center: this.center,
      extent: this.extent,
    }
    if (target === 'simulator') {
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


export class NodeSpatial extends Config {
  node: Node;
  positions: FreePositions | GridPositions;

  constructor(node: Node, spatial: any = {}) {
    super('NodeSpatial');
    this.node = node;
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

  isRandom(): boolean {
    return this.hasPositions() && this.positions.name === 'free'
  }

  toJSON(target: string = 'db'): any {
    return this.positions.toJSON(target);
  }

}
