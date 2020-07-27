import { Component, Input, OnInit } from '@angular/core';

import { MatMenuTrigger } from '@angular/material/menu';

import { Connection } from '../../../components/connection';
import { Model } from '../../../components/model';
import { Network } from '../../../components/network';
import { Node } from '../../../components/node';
import { Parameter } from '../../../components/parameter';


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
