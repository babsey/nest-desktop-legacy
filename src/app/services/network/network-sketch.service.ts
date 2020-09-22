import { Injectable } from '@angular/core';

import * as d3 from 'd3';

import { drawPath } from '../../components/connection/connectionGraph';


@Injectable({
  providedIn: 'root'
})
export class NetworkSketchService {
  private _connect = false;
  private _keyDown = '';

  constructor() {
  }

  get connect(): boolean {
    return this._connect;
  }

  set connect(value: boolean) {
    this._connect = value;
  }

  get keyDown(): string {
    return this._keyDown;
  }

  set keyDown(value: string) {
    this._keyDown = value;
  }

  reset(): void {
    const selector: any = d3.selectAll('.network-sketch');
    selector.selectAll('.dragline').attr('d', 'M0,0L0,0');
    selector.select('.select-panel').attr('transform', 'translate(0,0)');
    selector.selectAll('.select').remove();
  }

  dragLine(source: any, target: any, color: string, isTargetMouse: any = false): void {
    const selector = d3.selectAll('.network-sketch');
    selector.selectAll('.dragline')
      .attr('d', () => drawPath(source, target, { isTargetMouse }));
    selector.select('.mask')
      .style('stroke', color);
  }

}
