// `http://stackoverflow.com/questions/16358905/d3-force-layout-graph-self-linking-node
import { Component, OnInit, Input, ElementRef } from '@angular/core';

import * as d3 from 'd3';

import { NetworkService } from '../../services/network.service';
import { NetworkConfigService } from '../../network-config/network-config.service';
import { NetworkSketchService } from '../../network-sketch/network-sketch.service';

import { Data } from '../../../classes/data';
import { AppLink } from '../../../classes/appLink';


@Component({
  selector: 'g[app-link-sketch]',
  templateUrl: './link-sketch.component.html',
  styleUrls: ['./link-sketch.component.scss'],
})
export class LinkSketchComponent implements OnInit {
  @Input() data: Data;
  @Input() link: AppLink;
  @Input() width: number;
  @Input() height: number;
  @Input() selected: AppLink;
  @Input() color: string;
  private selector: any;
  private drag_line: any;
  private subscription: any;

  constructor(
    private _networkService: NetworkService,
    private _networkConfigService: NetworkConfigService,
    private _networkSketchService: NetworkSketchService,
    private elementRef: ElementRef,
  ) {
    this.selector = d3.select(elementRef.nativeElement);
  }

  ngOnInit() {
  }

  onClick(event: MouseEvent): void {
    this._networkService.selectLink(this.link);
  }

  synWeight(): number {
    var connectome = this.data.simulation.connectomes[this.link.idx];
    if (!('syn_spec' in connectome)) return 1
    if (!('weight' in connectome['syn_spec'])) return 1
    return connectome.syn_spec.weight
  }

  drawPath(): string {
    var connectome = this.data.simulation.connectomes[this.link.idx];
    var source = this.data.app.nodes[connectome.source].position;
    var target = this.data.app.nodes[connectome.target].position;
    return this._networkSketchService.drawPath(source, target, true)
  }

  distance(): number {
    var connectome = this.data.simulation.connectomes[this.link.idx];
    if (connectome.source == connectome.target) {return this._networkConfigService.config.sketch.link.maxDistance.value};
    var source = this.data.app.nodes[connectome.source].position;
    var target = this.data.app.nodes[connectome.target].position;
    var x1 = source.x,
      y1 = source.y,
      x2 = target.x,
      y2 = target.y,
      dx = x2 - x1,
      dy = y2 - y1,
      dr = Math.sqrt(dx * dx + dy * dy);
    return dr
  }

  nodeRadius(): number {
    return this._networkConfigService.config.sketch.node.radius.value / this.linkWidth() / Math.PI;
  }

  linkWidth(): number {
    return this._networkConfigService.config.sketch.link.width.value;
  }

  linkMaxDistance(): number {
    return this._networkConfigService.config.sketch.link.maxDistance.value;
  }

  linkOpacity(): number {
    return this._networkConfigService.config.sketch.link.opacity.value;
  }

  terminusOpacity(): number {
    return this._networkConfigService.config.sketch.link.terminusOpacity.value;
  }

  isNodeFocused(): boolean {
    var node = this._networkSketchService.focused.node;
    if (!node) return false;
    var connectome = this.data.simulation.connectomes[this.link.idx];
    return node.idx == connectome.source;
  }

  isLinkFocused(): boolean {
    var link = this._networkSketchService.focused.link;
    if (!link) return false;
    return this.link.idx == link.idx;
  }

  isNodeSelected(): boolean {
    var node = this._networkService.selected.node;
    if (!node) return false;
    var connectome = this.data.simulation.connectomes[this.link.idx];
    return node.idx == connectome.source;
  }

  isLinkSelected(): boolean {
    var link = this._networkService.selected.link;
    if (!link) return false;
    return this.link.idx == link.idx;
  }

}
