// `http://stackoverflow.com/questions/16358905/d3-force-layout-graph-self-linking-node

import {
  Component,
  OnInit
} from '@angular/core';
import * as d3 from 'd3';

import { DataService } from '../shared/services/data/data.service';
import { SketchService } from '../shared/services/sketch/sketch.service';

@Component({
  selector: 'g[app-link-sketch]',
  template: '',
  styleUrls: ['./link-sketch.component.css'],
})
export class LinkSketchComponent implements OnInit {
  private drag_line: any

  constructor(private service: SketchService, private _dataService: DataService) {
  }

  draw_path = (d) => {
    var nodes = this._dataService.data.collections;
    var pre = nodes[d.pre];
    var post = nodes[d.post];

    var x1 = pre.sketch.x,
      y1 = pre.sketch.y,
      x2 = post.sketch.x,
      y2 = post.sketch.y,
      dx = x2 - x1,
      dy = y2 - y1,
      dr = Math.sqrt(dx * dx + dy * dy),
      r = 28,

      // Defaults for normal edge.
      drx = dr,
      dry = dr,
      xRotation = 0, // degrees
      largeArc = 0, // 1 or 0
      sweep = 1; // 1 or 0

    // Self edge.
    if (x1 === x2 && y1 === y2) {
      // Fiddle with this angle to get loop oriented.
      xRotation = 0;

      // Needs to be 1.
      largeArc = 1;

      // Change sweep to change orientation of loop.
      sweep = 0;

      // Make drx and dry different to get an ellipse
      // instead of a circle.
      drx = 15;
      dry = 20;

      // For whatever reason the arc collapses to a point if the beginning
      // and ending points of the arc are the same, so kludge it.

      x1 = x1 - r / 2 / Math.sqrt(2);
      y1 = y1 + r;
      x2 = x2 + r / 2 / Math.sqrt(2);
      y2 = y2 + r * Math.sqrt(2);
    } else {
      x1 = x1 + (dx / dr * r);
      y1 = y1 + (dy / dr * r);
      x2 = x2 - (dx / dr * r) * Math.sqrt(2);
      y2 = y2 - (dy / dr * r) * Math.sqrt(2);
    }
    return 'M' + x1 + ',' + y1 + 'A' + drx + ',' + dry + ' ' + xRotation + ',' + largeArc + ',' + sweep + ' ' + x2 + ',' + y2;
  };

  update() {
    var self = this;
    var data = this._dataService.data;
    var options = this.service.options;
    var colors = options.nodes.colors;

    var links = d3.select('g[app-link-sketch]').selectAll("path").data(data.connectomes); // UPDATE

    links.exit().remove(); // EXIT

    links = links.enter().append("path") // ENTER
      .attr('class', 'link')
      .style('fill', 'none')
      .on('mousedown', function() {
        if (!options.drawing) {
          self.service.toggleSelectLink(this.__data__)
        }
      })
      .merge(links) // ENTER + UPDATE
      .attr('d', this.draw_path)
      .style('stroke',
        (d) => d.syn_spec ? (d.syn_spec.weight < 0 ? options.links.inh : options.links.exc) : options.links.exc
      )
      .style('stroke-width',
        (d) => Math.min(10, Math.max(5, ('weight' in d.syn_spec ? Math.abs(d.syn_spec.weight / 5) : 5)))
      )
      .style('stroke-dasharray', (d) => this.service.isSelectedLink(d) ? '10, 5' : '')
      .style('marker-end',
        (d) => d.syn_spec ? (d.syn_spec.weight < 0 ? 'url(#end-circle)' : 'url(#end-arrow)') : 'url(#end-arrow)'
      )
      .style('opacity', (d) => this.service.isSelectedLink(d) ? 1. : .7)


  }

  ngOnInit() {
    var g = d3.select('#sketch');

    // build the arrow.
    g.append('svg:defs').selectAll('marker')
      .data(['end-arrow']) // Different link/path types can be defined here
      .enter().append('svg:marker') // This section adds in the arrows
      .attr('id', String)
      .attr('viewBox', '0 -1.5 6 6')
      .attr('refX', 1.5)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-1.5L3,0L0,1.5');

    // build the circle.
    g.append('svg:defs').selectAll('marker')
      .data(['end-circle']) // Different link/path types can be defined here
      .enter().append('svg:marker') // This section adds in the arrows
      .attr('id', String)
      .attr('viewBox', '0 0 3 3')
      .attr('refX', 1.5)
      .attr('refY', 1.5)
      .attr('markerWidth', 3)
      .attr('markerHeight', 3)
      .attr('orient', 'auto')
      .append('svg:circle')
      .attr('r', 1.5)
      .attr('transform', 'translate(1.5,1.5)');


    this.update()
    this.service.update.subscribe(() => this.update())
  }
}
