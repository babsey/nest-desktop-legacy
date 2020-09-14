import { Component, OnInit, Input } from '@angular/core';

import { Node } from '../../../components/node/node';


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

  get dy(): string {
    return (this.node.view.weight === 'inhibitory' && this.node.model.elementType === 'neuron') ? '.4em' : '.7em';
  }

  get points(): string {
    return this.node.view.getPoints(this.radius);
  }

}
