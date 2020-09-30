import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Node } from '../../../components/node/node';

import { NetworkGraphService } from '../../../services/network/network-graph.service';


@Component({
  selector: 'app-node-menu',
  templateUrl: './node-menu.component.html',
  styleUrls: ['./node-menu.component.scss']
})
export class NodeMenuComponent implements OnInit {
  @Input() node: Node;
  @Input() disabled = false;

  constructor(
    private _networkGraphService: NetworkGraphService,
  ) { }

  ngOnInit() {
  }

  selectColor(color: string): void {
    this.node.view.color = color;
  }

}
