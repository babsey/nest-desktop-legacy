import { Component, OnInit, Input } from '@angular/core';

import { listAnimation } from '../../../animations/list-animation';

import { Connection } from '../../../components/connection/connection';
import { Network } from '../../../components/network/network';
import { Node } from '../../../components/node/node';



@Component({
  selector: 'app-network-list',
  templateUrl: './network-list.component.html',
  styleUrls: ['./network-list.component.scss'],
  animations: [
    listAnimation
  ]
})
export class NetworkListComponent implements OnInit {
  @Input() network: Network;
  @Input() selective: boolean = true;
  @Input() paramSelective: boolean = true;
  @Input() columns: boolean = false;

  constructor(
  ) { }

  ngOnInit() {
    // console.log('Init network list')
  }

  nodeDisplay(node: Node): boolean {
    return node.view.isSelected(true) || !this.selective;
  }

  connectionDisplay(connection: Connection): boolean {
    return connection.view.isSelected() || !this.selective;
  }

}
