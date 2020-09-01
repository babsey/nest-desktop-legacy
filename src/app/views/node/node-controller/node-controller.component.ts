import { Component, Input, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { Node } from '../../../components/node/node';


@Component({
  selector: 'app-node-controller',
  templateUrl: './node-controller.component.html',
  styleUrls: ['./node-controller.component.scss'],
})
export class NodeControllerComponent implements OnInit {
  @Input() node: Node;

  constructor() {
  }

  ngOnInit() {
  }

}
