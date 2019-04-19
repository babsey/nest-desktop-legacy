import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MdePopoverTrigger } from '@material-extended/mde';
import { MatBottomSheet } from '@angular/material';
import { Router } from '@angular/router';

import { AppConfigService } from '../config/app-config/app-config.service'
import { NavigationService } from './navigation.service';
import { NetworkSimulationService } from '../network/network-simulation/network-simulation.service';



@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  public show: boolean = true;

  constructor(
    private _networkSimulationService: NetworkSimulationService,
    public _appConfigService: AppConfigService,
    public _navigationService: NavigationService,
    public router: Router,
  ) {
  }

  ngOnInit() {
  }

  resize() {
    this._navigationService.options.sidenavShortView = !this._navigationService.options.sidenavShortView;
    setTimeout(() => this._networkSimulationService.resize.emit(), 500)
  }

}
