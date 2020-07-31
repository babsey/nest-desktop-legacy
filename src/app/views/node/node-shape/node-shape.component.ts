import { Component, OnInit, Input } from '@angular/core';

import { Node } from '../../../components/node/node';
import * as NodeGraph from '../../../components/node/nodeGraph';


@Component({
  selector: '[app-node-shape]',
  templateUrl: './node-shape.component.html',
  styleUrls: ['./node-shape.component.scss']
})
export class NodeShapeComponent implements OnInit {
  @Input() node: Node;
  @Input() radius: number = 18;
  @Input() strokeWidth: number = 2.5;
  @Input() labelSize: number = 10;
  @Input() showSelection: boolean = true;

  constructor(
  ) { }

  ngOnInit() {
  }

  points(shape: string) {
    if (shape === 'layer') {
      return NodeGraph.getLayerPoints(this.radius);
    } else if (shape === 'triangle') {
      return NodeGraph.getTrianglePoints(this.radius);
    } else {
      return NodeGraph.getSquarePoints(this.radius);
    }
  }

}
