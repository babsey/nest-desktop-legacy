import { Component, OnInit, Input } from '@angular/core';

import { NetworkService } from '../services/network.service';

import { Network } from '../../components/network';
import { Node } from '../../components/node';
import { Connection } from '../../components/connection';

import { listAnimation } from '../../animations/list-animation';


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
    private _networkService: NetworkService,
  ) { }

  ngOnInit() {
    // console.log('Init network list')
  }

  nodeDisplay(node: Node): boolean {
    return node.view.isSelected() || !this.selective;
  }

  connectionDisplay(connection: Connection): boolean {
    return connection.view.isSelected() || !this.selective;
  }

}
