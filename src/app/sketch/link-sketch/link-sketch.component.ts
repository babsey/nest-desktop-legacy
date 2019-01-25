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

    var defs = this.host.append('svg:defs');

    var hillocks = defs.selectAll('.hillock').data(this._colorService.nodes)
    hillocks.exit().remove();
    hillocks.enter().append('svg:marker') // This section adds in the arrows
      .attr('id', d => 'hillock_' + d[1])
      .attr('class', 'hillock')
      .attr('viewBox', '0 0 5 3')
      .attr('refX', 3.5)
      .attr('refY', 1.5)
      .attr('markerWidth', 5)
      .attr('markerHeight', 3)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0.5,0L5,1.5L0,2.5')
      .style('fill', d => d[0]);

    var exc = defs.selectAll('.exc').data(this._colorService.nodes)
    exc.exit().remove();
    exc.enter().append('svg:marker') // This section adds in the arrows
      .attr('id', d => 'exc_' + d[1])
      .attr('class', 'exc')
      .attr('viewBox', '0 0 5 5')
      .attr('refX', 4)
      .attr('refY', 2.5)
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M3.5,0L0,2.5L5,4.5')
      .style('fill', d => d[0]);

    var inh = defs.selectAll('.inh').data(this._colorService.nodes)
    inh.exit().remove();
    inh.enter().append('svg:marker') // This section adds in the arrows
      .attr('id', d => 'inh_' + d[1])
      .attr('class', 'inh')
      .attr('viewBox', '0 0 5 5')
      .attr('refX', 4)
      .attr('refY', 2.5)
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('svg:circle')
      .attr('r', 2)
      .style('fill', d => d[0])
      .attr('transform', 'translate(2.5,2.5)');
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
      .attr('d', this.drawPath)
      .style('stroke', d => this.nodeColor(d.pre))
      .style('stroke-dasharray', d => this._sketchService.isSelectedLink(d) ? '10, 5' : '')
      .style('marker-start', d => 'url(#hillock_' + this.nodeColorname(d.pre) + ')')
      .style('marker-end', d => 'url(#' + this.linkMarker(d) + '_' + this.nodeColorname(d.pre) + ')')
  }

  nodeColor(idx) {
    var colors = this._colorService.nodes;
    return colors[idx % colors.length][0]
  }

  nodeColorname(idx) {
    var colors = this._colorService.nodes;
    return colors[idx % colors.length][1]
  }

  linkMarker(link) {
    if (!('syn_spec' in link)) return 'exc'
    if (!('weight' in link['syn_spec'])) return 'exc'
    return link.syn_spec.weight < 0 ? 'inh' : 'exc'
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

  drawPath = (link) => {
    var nodes = this.data.collections;
    var pre = nodes[link.pre];
    var post = nodes[link.post];
    return this._sketchService.drawPath(pre.sketch, post.sketch, true)
  }

}
