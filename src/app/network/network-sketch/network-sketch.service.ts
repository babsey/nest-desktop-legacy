import { Injectable } from '@angular/core';

import * as d3 from 'd3';

import { NetworkConfigService } from '../network-config/network-config.service';


@Injectable({
  providedIn: 'root'
})
export class NetworkSketchService {
  public options: any = {
    width: 0,
    height: 0,
  };
  public focused: any = {
    node: null,
    link: null,
  }
  public keyDown: string = '';

  constructor(
    public _networkConfigService: NetworkConfigService,
  ) {
  }

  drawPath(source: any, target: any, isTargetNode: boolean = false): string {

    var x1 = source.x,
      y1 = source.y,
      x2 = target.x,
      y2 = target.y,
      dx = x2 - x1,
      dy = y2 - y1,
      dr = Math.sqrt(dx * dx + dy * dy),
      r = this._networkConfigService.config.sketch.node.radius + 5;

    // Defaults for normal edge.
    var ellipticalArc = this._networkConfigService.config.sketch.link.ellipticalArc.value;
    var xAxisRotation = this._networkConfigService.config.sketch.link.xAxisRotation.value;
    var drx = dr * ellipticalArc * 2,
      dry = dr * ellipticalArc,
      xAxisRotation = xAxisRotation, // degrees
      largeArc = 0, // 1 or 0
      sweep = 0; // 1 or 0

    // Self edge.
    if (x1 === x2 && y1 === y2) {
      // Fiddle with this angle to get loop oriented.

      // Needs to be 1.
      largeArc = 1;

      // Change sweep to change orientation of loop.
      sweep = 0;

      // Make drx and dry different to get an ellipse
      // instead of a circle.
      drx = 30;
      dry = 15;

      // For whatever reason the arc collapses to a point if the beginning
      // and ending points of the arc are the same, so kludge it.
      x1 = x1 - .1;
      x2 = x2 + .1;
    }
    return 'M' + x1 + ',' + y1 + 'A' + drx + ',' + dry + ' ' + xAxisRotation + ',' + largeArc + ',' + sweep + ' ' + x2 + ',' + y2;
  };

  reset(): void {
    var selector = d3.selectAll('.network-sketch');
    selector.selectAll('.dragline').attr('d', 'M0,0L0,0');
    selector.select('.select-panel').attr('transform', 'translate(0,0)')
    selector.selectAll('.select').remove();
  }

  dragLine(source: any, target: any, color: string, isTargetNode = false): void {
    var selector = d3.selectAll('.network-sketch');
    selector.selectAll('.dragline')
      .attr('d', () => this.drawPath(source, target, isTargetNode));
    selector.select('.mask')
      .style('stroke', color);
  }

}
