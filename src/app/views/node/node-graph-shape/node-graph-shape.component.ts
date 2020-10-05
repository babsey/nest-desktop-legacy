import { Component, OnInit, Input } from '@angular/core';

import { Node } from '../../../components/node/node';


@Component({
  selector: '[app-node-graph-shape]',
  templateUrl: './node-graph-shape.component.html',
  styleUrls: ['./node-graph-shape.component.scss']
})
export class NodeGraphShapeComponent implements OnInit {
  @Input() labelSize = 10;
  @Input() node: Node;
  @Input() radius = 18;
  @Input() showSelection = true;
  @Input() strokeWidth = 2.5;

  constructor() {
  }

  ngOnInit() {
  }

  get dy(): string {
    return this.drawCircle() ? '.4em' : '.7em';
  }

  get points(): string {
    return this.node.view.getPoints(this.radius);
  }

  drawCircle(): boolean {
    return (
      this.node.view.weight === 'inhibitory' &&
      this.node.model.elementType === 'neuron'
    );
  }

}
