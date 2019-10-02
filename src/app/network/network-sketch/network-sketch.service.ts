import { Injectable, EventEmitter } from '@angular/core';

import * as d3 from 'd3';


@Injectable({
  providedIn: 'root'
})
export class NetworkSketchService {
  public options: any = {
    width: 0,
    height: 0,
    node: {
      radius: 15,
    },
    link: {
      xRotation: 0,
    },
    drawing: false,
  };
  public update: EventEmitter<any> = new EventEmitter();
  public focused: any = {
    node: null,
    link: null,
  }

  constructor(
  ) {
  }

  edit(mode: any = null) {
    this.options.drawing = (mode != null) ? mode : !this.options.drawing;
  }

  drawPath(source: any, target: any, isTargetNode: boolean = false) {
    var x1 = source.x,
      y1 = source.y,
      x2 = target.x,
      y2 = target.y,
      dx = x2 - x1,
      dy = y2 - y1,
      dr = Math.sqrt(dx * dx + dy * dy),
      r = this.options.node.radius + 5,

      // Defaults for normal edge.
      drx = dr,
      dry = dr,
      xRotation = this.options.link.xRotation, // degrees
      largeArc = 0, // 1 or 0
      sweep = 1; // 1 or 0

    // Self edge.
    if (x1 === x2 && y1 === y2) {
      // Fiddle with this angle to get loop oriented.
      xRotation = this.options.link.xRotation;

      // Needs to be 1.
      largeArc = 1;

      // Change sweep to change orientation of loop.
      sweep = 0;

      // Make drx and dry different to get an ellipse
      // instead of a circle.
      drx = 16;
      dry = 16;

      // For whatever reason the arc collapses to a point if the beginning
      // and ending points of the arc are the same, so kludge it.
      x1 = x1 - r / 2 * Math.sqrt(2);
      y1 = y1 + r / 2 * Math.sqrt(2);
      x2 = x2 + r / 2 * Math.sqrt(2);
      y2 = y2 + r / 2 * Math.sqrt(2);
    } else {
      x1 = x1 + (dx / dr * r);
      y1 = y1 + (dy / dr * r);
      if (isTargetNode) {
        x2 = x2 - (dx / dr * r);
        y2 = y2 - (dy / dr * r);
      } else {
        x2 = x2 - (dx / dr * 5) * Math.sqrt(2);
        y2 = y2 - (dy / dr * 5) * Math.sqrt(2);
      }
    }
    return 'M' + x1 + ',' + y1 + 'A' + drx + ',' + dry + ' ' + xRotation + ',' + largeArc + ',' + sweep + ' ' + x2 + ',' + y2;
  };

}
