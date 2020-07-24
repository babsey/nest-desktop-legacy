// `http://stackoverflow.com/questions/16358905/d3-force-layout-graph-self-linking-node
import { Component, OnInit, OnDestroy, Input, ElementRef } from '@angular/core';

import * as d3 from 'd3';


import { Connection } from '../../../components/connection';
import { Node } from '../../../components/node';


@Component({
  selector: 'g[app-link-sketch]',
  templateUrl: './link-sketch.component.html',
  styleUrls: ['./link-sketch.component.scss'],
})
export class LinkSketchComponent implements OnInit, OnDestroy {
  @Input() connection: Connection;
  @Input() width: number;
  @Input() height: number;
  public color: string = 'white';
  private selector: any;
  private intervalId: any;

  constructor(
    private elementRef: ElementRef,
  ) {
    this.selector = d3.select(elementRef.nativeElement);
  }

  ngOnInit() {
    this.color = this.connection.source.view.color;
    this.intervalId = setInterval(() => {
      this.color = this.connection.source.view.color;
    }, 100)
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  onClick(event: MouseEvent): void {
    this.connection.view.select();
  }

  onMouseover(event: MouseEvent): void {
    this.connection.view.focus();
  }

  markerEnd(): string {
    if (this.connection.synapse.weight > 0) {
      return 'url(#exc' + this.connection.idx + ')'
    } else if (this.connection.synapse.weight < 0) {
      return 'url(#inh' + this.connection.idx + ')'
    } else {
      return ''
    }
  }

  nodeRadius(): number {
    return this.connection.source.config.data.graph.radius.value / this.linkWidth() / Math.PI;
  }

  linkWidth(): number {
    return this.connection.config.data.graph.width.value;
  }

  linkOpacity(): number {
    return this.connection.config.data.graph.opacity.value;
  }

  terminusOpacity(): number {
    return this.connection.config.data.graph.terminusOpacity.value;
  }

  dashLine(): boolean {
    return this.connection.view.probabilistic();
  }

  opacity(): boolean {
    const node: Node = this.connection.source;
    const isNodeFocused: boolean = node.view.isFocused();
    const isNodeSelected: boolean = node.view.isSelected();
    const isConnectionFocused: boolean = this.connection.view.isFocused();
    const isConnectionSelected: boolean = this.connection.view.isSelected();
    return isNodeFocused || isNodeSelected || isConnectionFocused || isConnectionSelected;
  }

}
