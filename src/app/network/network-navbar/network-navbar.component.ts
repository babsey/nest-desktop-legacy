import { Component, OnInit } from '@angular/core';

import { NetworkService } from '../services/network.service';


@Component({
  selector: 'app-network-navbar',
  templateUrl: './network-navbar.component.html',
  styleUrls: ['./network-navbar.component.scss']
})
export class NetworkNavbarComponent implements OnInit {

  constructor(
    private _networkService: NetworkService,
  ) { }

  ngOnInit() {
  }

  selectElementType(elementType: string): void {
    this._networkService.selectElementType(elementType)
  }

  isSelected(elementType: string): boolean {
    return this._networkService.elementType == null || this._networkService.elementType == elementType;
  }

}
