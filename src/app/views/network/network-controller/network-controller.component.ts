import { Component, OnInit, Input } from '@angular/core';

import { Network } from '../../../components/network/network';


@Component({
  selector: 'app-network-controller',
  templateUrl: './network-controller.component.html',
  styleUrls: ['./network-controller.component.scss']
})
export class NetworkControllerComponent implements OnInit {
  @Input() network: Network;
  private _options: any;

  constructor() {
    this._options = {
      min: 0,
      max: 100,
      label: 'test',
    };
  }

  ngOnInit() {
  }

  get options(): any {
    return this._options;
  }

}
