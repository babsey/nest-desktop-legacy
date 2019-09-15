import { Component, OnInit, Input } from '@angular/core';

import { Data } from '../../classes/data';

import { NetworkService } from '../services/network.service';


@Component({
  selector: 'app-network-list',
  templateUrl: './network-list.component.html',
  styleUrls: ['./network-list.component.scss']
})
export class NetworkListComponent implements OnInit {
  @Input() data: Data;
  @Input() selective: boolean = true;
  @Input() paramSelective: boolean = true;

  constructor(
    private _networkService: NetworkService,
  ) { }

  ngOnInit() {
    // console.log('Init network list')
  }

  nodeDisplay(node) {
    return this._networkService.isNodeSelected(node, this.data) || !this.selective;
  }

  linkDisplay(link) {
    return this._networkService.isLinkSelected(link, this.data) || !this.selective;
  }

}
