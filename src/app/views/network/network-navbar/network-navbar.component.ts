import { Component, OnInit, Input } from '@angular/core';

import { Network } from '../../../components/network/network';


@Component({
  selector: 'app-network-navbar',
  templateUrl: './network-navbar.component.html',
  styleUrls: ['./network-navbar.component.scss']
})
export class NetworkNavbarComponent implements OnInit {
  @Input() network: Network;

  constructor() {
  }

  ngOnInit() {
  }

}
