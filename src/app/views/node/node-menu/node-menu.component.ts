import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Node } from '../../../components/node/node';

import { NetworkSketchService } from '../../../services/network/network-sketch.service';


@Component({
  selector: 'app-node-menu',
  templateUrl: './node-menu.component.html',
  styleUrls: ['./node-menu.component.scss']
})
export class NodeMenuComponent implements OnInit {
  @Input() node: Node;
  @Input() disabled: boolean = false;

  constructor(
    private _networkSketchService: NetworkSketchService,
  ) { }

  ngOnInit() {
  }

  selectColor(color: string): void {
    this.node.view.color = color;
  }

}
