import { Component, OnInit, Input, ElementRef } from '@angular/core';

import { drag } from 'd3-drag';
import { select } from 'd3-selection';

import { Node } from '../../../components/node/node';

import { NetworkGraphService } from '../../../services/network/network-graph.service';


@Component({
  selector: 'g[app-node-graph]',
  templateUrl: 'node-graph.component.html',
  styleUrls: ['./node-graph.component.scss'],
})
export class NodeGraphComponent implements OnInit {
  @Input() node: Node;
  @Input() dragable: boolean;
  @Input() eventTrigger = true;
  @Input() height: number;
  @Input() width: number;
  private _disabled = false;
  private _selector: any;

  constructor(
    private _networkGraphService: NetworkGraphService,
    private _elementRef: ElementRef,
  ) {
    this._selector = select(_elementRef.nativeElement);
  }

  ngOnInit() {
    if (this.node === undefined) { return; }
    if (this.dragable) {
      const node = this._selector.selectAll('g.node').data([this.node]); // UPDATE
      node.on('mousedown.drag', null);
      node.call(this.dragHandler());
    }
  }

  get radius(): number {
    // const radius: number = this.node.config.graph.radius.value;
    const radius = 18;
    return this.node.network.view.focusedNode === this.node ? radius + 3 : radius;
  }

  get strokeWidth(): number {
    return this.node.config.graph.strokeWidth.value;
  }

  isDisabled(): boolean {
    return this._disabled;
  }

  enable(): void {
    this._disabled = false;
  }

  connect(sourceNode: Node): void {
    const connection: any = {
      source: sourceNode.idx,
      target: this.node.idx,
    };
    this.node.network.addConnection(connection);
    if (sourceNode.model.elementType === 'recorder' || this.node.model.elementType === 'recorder') {
      this.node.initActivityGraph();
    }
    this.node.network.networkChanges();
  }

  onClick(event: MouseEvent): void {
    this._disabled = true;
    const selectedNode: Node = this.node.network.view.selectedNode;
    if (this.eventTrigger && selectedNode && this.node.view.isFocused() && this._networkGraphService.connect) {
      this.connect(selectedNode);
      if (this._networkGraphService.keyDown === '17') { return; }                     // STRG
      this.node.network.view.resetSelection();
      this._networkGraphService.reset();
    } else {
      this.node.network.view.selectedNode = this.node;
    }
    this._networkGraphService.connect = false;
  }

  dragHandler(): any {
    const r: number = this.node.config.graph.radius.value + 3;
    return drag().on('drag', (event: MouseEvent) => {
      this.node.network.view.resetSelection();
      this.node.network.view.resetFocus();
      const x: number = event.x;
      const y: number = event.y;
      if (x < r || x > this.width - r - 1) { return; }
      if (y < r || y > this.height - r - 1) { return; }
      this.node.view.position.x = x;
      this.node.view.position.y = y;
    });
  }

}
