import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MdePopoverTrigger } from '@material-extended/mde';
import { MatBottomSheet } from '@angular/material';

import {
  faBars,
  faDesktop,
  faDownload,
  faInfo,
  faPencilAlt,
  faSignature,
} from '@fortawesome/free-solid-svg-icons';


import { ConfigService } from '../config/config.service';
import { NavigationService } from './navigation.service';
import { NetworkService } from '../services/network/network.service';
import { ProtocolService } from '../services/protocol/protocol.service';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  public options: any;
  public selectedIndex: any;

  public faBars = faBars;
  public faDesktop = faDesktop;
  public faInfo = faInfo;
  public faPencilAlt = faPencilAlt;
  public faSignature = faSignature;

  constructor(
    private _configService: ConfigService,
    private _networkService: NetworkService,
    private _protocolService: ProtocolService,
    public _navigationService: NavigationService,
  ) {
  }

  ngOnInit() {
    this._configService.init()
    this._networkService.init()
    this._protocolService.init()
    this._protocolService.list(this);
    this._protocolService.count().then(val => {
      this.selectedIndex = (val == 0 ? '0' : '1');
    })
  }

}
