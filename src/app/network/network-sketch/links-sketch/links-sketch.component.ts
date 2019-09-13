// `http://stackoverflow.com/questions/16358905/d3-force-layout-graph-self-linking-node
import { Component, OnInit, OnChanges, Input, ElementRef, OnDestroy } from '@angular/core';

import * as d3 from 'd3';

import { ColorService } from '../../services/color.service';
import { NetworkService } from '../../services/network.service';
import { NetworkSketchService } from '../network-sketch.service';

import { Data } from '../../../classes/data';

@Component({
  selector: 'g[app-links-sketch]',
  template: '',
  styleUrls: ['./links-sketch.component.scss'],
})
export class LinksSketchComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: Data;
  @Input() width: number;
  @Input() height: number;
  private host: any;
  private selector: any;
  private drag_line: any;
  private subscription: any;

  constructor(
    private _colorService: ColorService,
    private _networkService: NetworkService,
    private _networkSketchService: NetworkSketchService,
    private elementRef: ElementRef,
  ) {
    this.host = d3.select(elementRef.nativeElement.parentElement);
    this.selector = d3.select(elementRef.nativeElement);
    this.host.append('svg:defs');
  }

  ngOnInit() {
    // console.log('Init link sketch')
    this.subscription = this._networkSketchService.update.subscribe(() => this.update())
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
    var nodes = this.data.app.nodes;
    var links = this.data.app.links;
    var connectomes = this.data.simulation.connectomes;
    var _this = this;

    var colors = this._colorService.colors();
    nodes.map(node => {
      if ('color' in node) {
        if (colors.indexOf(node['color']) == -1) {
          colors.push(node['color'])
        }
      }
    })

    var defs = this.host.selectAll('defs');

    var hillocks = defs.selectAll('.hillock').data(colors)
    hillocks.exit().remove();

    hillocks.enter().append('svg:marker') // This section adds in the arrows
      .attr('id', d => 'hillock_' + d)
      .attr('class', 'hillock')
      .attr('viewBox', '0 0 5 3')
      .attr('refX', 3.5)
      .attr('refY', 1.5)
      .attr('markerWidth', 5)
      .attr('markerHeight', 3)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0.5,0L5,1.5L0,2.5')
      .style('fill', d => d)

    var exc = defs.selectAll('.exc').data(colors)
    exc.exit().remove();
    exc.enter().append('svg:marker') // This section adds in the arrows
      .attr('id', d => 'exc_' + d)
      .attr('class', 'exc')
      .attr('viewBox', '0 0 5 5')
      .attr('refX', 4)
      .attr('refY', 2.5)
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M3.5,0L0,2.5L5,4.5')
      .style('fill', d => d);

    var inh = defs.selectAll('.inh').data(colors)
    inh.exit().remove();
    inh.enter().append('svg:marker') // This section adds in the arrows
      .attr('id', d => 'inh_' + d)
      .attr('class', 'inh')
      .attr('viewBox', '0 0 5 5')
      .attr('refX', 4)
      .attr('refY', 2.5)
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('svg:circle')
      .attr('r', 2)
      .attr('transform', 'translate(2.5,2.5)')
      .style('fill', d => d);

    var gLinks = this.selector.selectAll(".link").data(links); // UPDATE

    gLinks.exit().remove(); // EXIT

    gLinks = gLinks.enter().append("svg:path") // ENTER
      .attr('class', 'link')
      .on('mousedown', function() {
        _this.host.selectAll('.select').remove();
        _this._networkService.selectLink(this.__data__)
      })
      .merge(gLinks) // ENTER + UPDATE
      .attr('d', d => this.drawPath(d))
      .style('cursor', 'pointer')
      .style('fill', 'none')
      .style('stroke', d => this._colorService.node(_this.preNode(d.idx)))
      .style('stroke-width', '2.5px')
      .style('stroke-dasharray', d => this._networkService.selected.link == d ? '10, 5' : '')
      .style('marker-start', d => 'url(#hillock_' + this._colorService.node(_this.preNode(d.idx)) + ')')
      .style('marker-end', d => 'url(#' + this.linkMarker(d) + '_' + this._colorService.node(_this.preNode(d.idx)) + ')')
  }

  linkMarker(link: any) {
    var connectome = this.data.simulation.connectomes[link.idx];
    if (!('syn_spec' in connectome)) return 'exc'
    if (!('weight' in connectome['syn_spec'])) return 'exc'
    return connectome.syn_spec.weight < 0 ? 'inh' : 'exc'
  }

  drawPath(link: any) {
    var connectome = this.data.simulation.connectomes[link.idx];
    var nodes = this.data.app.nodes;
    return this._networkSketchService.drawPath(nodes[connectome.pre].position, nodes[connectome.post].position, true)
  }

  preNode(idx: number) {
    var connectome = this.data.simulation.connectomes[idx];
    return this.data.app.nodes[connectome.pre];
  }

}
