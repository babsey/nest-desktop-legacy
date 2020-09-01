import { Component, OnInit, Input } from '@angular/core';

import { Network } from '../../../components/network/network';


@Component({
  selector: 'app-network-selection',
  templateUrl: './network-selection.component.html',
  styleUrls: ['./network-selection.component.scss']
})
export class NetworkSelectionComponent implements OnInit {
  @Input() network: Network;

  constructor(
  ) { }

  ngOnInit() {
    // console.log('Init network selection')
  }

}
