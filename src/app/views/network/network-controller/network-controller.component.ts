import { Component, OnInit, Input } from '@angular/core';

import { Network } from '../../../components/network/network';


@Component({
  selector: 'app-network-controller',
  templateUrl: './network-controller.component.html',
  styleUrls: ['./network-controller.component.scss']
})
export class NetworkControllerComponent implements OnInit {
  @Input() network: Network;
  public options: any = {
    min: 0, max: 100, label: 'test',
  };

  constructor(
  ) { }

  ngOnInit() {
  }

}
