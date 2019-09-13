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
    var links = this.data.app.links.filter(link => {
      var connectome = this.data.simulation.connectomes[link.idx];
      return connectome.pre == node.idx || connectome.post == node.idx;
    })
    var selected = links.filter(link => this._networkService.isSelected(node, link, true));
    return !this.selective || selected.length > 0 || this._networkService.isSelected(node, null, false);
  }

  linkDisplay(link) {
    var connectome = this.data.simulation.connectomes[link.idx];
    var preNode = this.data.app.nodes[connectome.pre];
    var selected = this._networkService.isSelected(preNode, link, true)
    return selected || !this.selective;
  }


}
