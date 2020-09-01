import { Injectable } from '@angular/core';

import * as d3 from 'd3';

import { drawPath } from '../../components/connection/connectionGraph';


@Injectable({
  providedIn: 'root'
})
export class NetworkSketchService {
  public options: any = {
    width: 0,
    height: 0,
  };
  public keyDown: string = '';
  public connect: boolean = false;
  public viewDragline = true;

  constructor(
  ) {
  }

  reset(): void {
    const selector: any = d3.selectAll('.network-sketch');
    selector.selectAll('.dragline').attr('d', 'M0,0L0,0');
    selector.select('.select-panel').attr('transform', 'translate(0,0)')
    selector.selectAll('.select').remove();
    this.viewDragline = false;
  }

  dragLine(source: any, target: any, color: string, isTargetMouse: any = false): void {
    const selector = d3.selectAll('.network-sketch');
    selector.selectAll('.dragline')
      .attr('d', () => drawPath(source, target, { isTargetMouse: isTargetMouse }));
    selector.select('.mask')
      .style('stroke', color);
  }

}
