// `http://stackoverflow.com/questions/16358905/d3-force-layout-graph-self-linking-node
import { Component, OnInit, Input, ElementRef } from '@angular/core';

import * as d3 from 'd3';

import { Connection } from '../../../components/connection/connection';
import { Node } from '../../../components/node/node';


@Component({
  selector: 'g[app-connection-graph]',
  templateUrl: './connection-graph.component.html',
  styleUrls: ['./connection-graph.component.scss'],
})
export class ConnectionGraphComponent implements OnInit {
  @Input() connection: Connection;
  @Input() height: number;
  @Input() width: number;
  private _intervalId: any;
  private _selector: any;

  constructor(
    private _elementRef: ElementRef,
  ) {
    this._selector = d3.select(_elementRef.nativeElement);
  }

  ngOnInit() {
  }

  get color(): string {
    return this.connection.source.view.color;
  }

  onClick(event: MouseEvent): void {
    this.connection.view.select();
  }

  onMouseover(event: MouseEvent): void {
    this.connection.view.focus();
  }

  markerEnd(): string {
    if (this.connection.synapse.weight > 0 && !this.connection.view.connectRecorder()) {
      return 'url(#exc' + this.connection.idx + ')';
    } else if (this.connection.synapse.weight < 0 && !this.connection.view.connectRecorder()) {
      return 'url(#inh' + this.connection.idx + ')';
    } else {
      return 'url(#generic' + this.connection.idx + ')';
    }
  }

  nodeRadius(): number {
    return this.connection.source.config.graph.radius.value / this.connectionWidth() / Math.PI;
  }

  connectionWidth(): number {
    return this.connection.config.graph.width.value;
  }

  connectionOpacity(): number {
    return this.connection.config.graph.opacity.value;
  }

  terminusOpacity(): number {
    return this.connection.config.graph.terminusOpacity.value;
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
