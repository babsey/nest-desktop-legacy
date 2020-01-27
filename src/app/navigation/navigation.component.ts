import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MdePopoverTrigger } from '@material-extended/mde';
import { MatBottomSheet } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { AppConfigService } from '../config/app-config/app-config.service';
import { NavigationService } from './navigation.service';
import { ModelService } from '../model/model.service';
import { SimulationProtocolService } from '../simulation/services/simulation-protocol.service';
import { SimulationService } from '../simulation/services/simulation.service';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    public _appConfigService: AppConfigService,
    public _modelService: ModelService,
    public _navigationService: NavigationService,
    public _simulationProtocolService: SimulationProtocolService,
    public _simulationService: SimulationService,
    public router: Router,
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this._navigationService.sidenavOpened = this.isNavLoaded();
    }, 1000)
  }

  isNavLoaded(mode: string = ''): boolean {
    return window.location.href.includes('nav:' + mode)
  }

  toggleSidenav(): void {
    this._navigationService.sidenavOpened = !this._navigationService.sidenavOpened;
  }

  onClick(event: MouseEvent, mode: string = ''): void {
    if (mode == '') {
      this.router.navigate([{ outlets: { primary: null, nav: null } }]);
      this._navigationService.sidenavOpened = false;
    } else {
      var url = window.location.href;
      var isActivated = url.includes('nav:' + mode);
      setTimeout(() => {
        this._navigationService.sidenavOpened = !isActivated || !this._navigationService.sidenavOpened;
      }, 10)
      var nav = this.isNavLoaded(mode) ? null : mode
      if (mode == 'simulation') {
        if (this._simulationService.data) {
          var url = 'simulation/' + this._simulationService.data._id;
          this.router.navigate([{ outlets: { primary: url, nav: nav } }]);
        }
      } else if (mode == 'model') {
        if (this._modelService.selectedModel) {
          var url = 'model/' + this._modelService.selectedModel;
          this.router.navigate([{ outlets: { primary: url, nav: nav } }]);
        }
      }
    }
  }
}
