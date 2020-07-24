import { Component, OnInit, Input } from '@angular/core';

import { Node } from '../../../components/node';


@Component({
  selector: '[app-node-shape]',
  templateUrl: './node-shape.component.html',
  styleUrls: ['./node-shape.component.scss']
})
export class NodeShapeComponent implements OnInit {
  @Input() node: Node;
  @Input() radius: number = 15;
  @Input() strokeWidth: number = 2.5;
  @Input() labelSize: number = 12;
  @Input() showSelection: boolean = true;

  constructor(
  ) { }

  ngOnInit() {
  }

}
