// `http://stackoverflow.com/questions/16358905/d3-force-layout-graph-self-linking-node

import {
  Component,
  OnInit,
  OnChanges,
  Input,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import * as d3 from 'd3';

import { ColorService } from '../../services/color/color.service';
import { ControllerService } from '../../controller/controller.service';
import { DataService } from '../../services/data/data.service';
import { SketchService } from '../../sketch/sketch.service';

@Component({
  selector: 'g[app-link-sketch]',
  template: '',
  styleUrls: ['./link-sketch.component.css'],
})
export class LinkSketchComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: any;
  @Input() width: any;
  @Input() height: any;
  private host: d3.Selection;
  private selector: d3.Selection;
  private drag_line: any
  private subscription: any

  constructor(
    private _colorService: ColorService,
    private _controllerService: ControllerService,
    private _dataService: DataService,
    private _sketchService: SketchService,
    private elementRef: ElementRef,
  ) {
    this.host = d3.select(elementRef.nativeElement.parentElement);
    this.selector = d3.select(elementRef.nativeElement);

    // build the arrow.
    this.host.append('svg:defs').selectAll('marker')
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
    this.host.append('svg:defs').selectAll('marker')
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
  }

  ngOnInit() {
    // console.log('Init link sketch')
    this.subscription = this._sketchService.update.subscribe(() => this.update())
  }

  ngOnDestroy() {
    // console.log('Destroy link sketch')
    this.subscription.unsubscribe()
  }

  ngOnChanges() {
    // console.log('Change link sketch')
    this.update()
  }


  update() {
    // console.log('Update link sketch')
    if (this.data == undefined) return
    if (Object.keys(this.data).length === 0 && this.data.constructor === Object) return
    var _this = this;
    var colors = this._colorService.links;

    var links = this.selector.selectAll(".link").data(this.data.connectomes); // UPDATE

    links.exit().remove(); // EXIT

    links = links.enter().append("svg:path") // ENTER
      .attr('class', 'link')
      .on('mousedown', function() {
        if (!_this._controllerService.options.edit) {
          _this._sketchService.toggleSelectLink(this.__data__)
        }
      })
      .merge(links) // ENTER + UPDATE
      .attr('d', this.draw_path)
      .style('stroke', d => this.linkColor(d))
      .style('stroke-width', d => this.linkWidth(d))
      .style('stroke-dasharray', d => this._sketchService.isSelectedLink(d) ? '10, 5' : '')
      .style('marker-end', d => this.linkMarker(d))
      .style('opacity', d => this._sketchService.isSelectedLink(d) ? 1. : .7)
  }

  linkColor(link) {
    var colors = this._colorService.links;
    if ('syn_spec' in link) {
      if ('weight' in link['syn_spec']) {
        return link.syn_spec.weight < 0 ? colors.inh : colors.exc
      }
    }
    return colors.exc
  }

  linkWidth(link) {
    var weight = 5;
    if ('syn_spec' in link) {
      if ('weight' in link['syn_spec']) {
        weight = Math.abs(link.syn_spec.weight);
      }
    }
    return Math.min(10, Math.max(5, weight / 5))
  }

  linkMarker(link) {
    if ('syn_spec' in link) {
      if ('weight' in link['syn_spec']) {
        return link.syn_spec.weight < 0 ? 'url(#end-circle)' : 'url(#end-arrow)'
      }
    }
    return 'url(#end-arrow)'
  }

  draw_path = (link) => {
    var nodes = this.data.collections;
    var pre = nodes[link.pre];
    var post = nodes[link.post];

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

}
