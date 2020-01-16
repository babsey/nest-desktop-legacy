import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MdePopoverTrigger } from '@material-extended/mde';
import { MatBottomSheet } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { AppConfigService } from '../config/app-config/app-config.service';
import { NavigationService } from './navigation.service';
import { ModelService } from '../model/model.service';
import { SimulationService } from '../simulation/services/simulation.service';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @Input() ready: boolean;
  @Output() readyChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private _modelService: ModelService,
    private _simulationService: SimulationService,
    private route: ActivatedRoute,
    public _appConfigService: AppConfigService,
    public _navigationService: NavigationService,
    public router: Router,
  ) {
  }

  ngOnInit() {
  }

  toggleSidenav(): void {
    this._navigationService.sidenavOpened = !this._navigationService.sidenavOpened;
  }

  onClick(event: MouseEvent, mode: string): void {
    var url = window.location.href;
    if (this.ready) {
      var isActivated = url.includes(('nav:' + mode));
      setTimeout(() => {
        this._navigationService.sidenavOpened = !isActivated || !this._navigationService.sidenavOpened;
      }, 10)
    }
    if (mode == 'simulation') {
      if (this._simulationService.data) {
        var url = 'simulation/' + this._simulationService.data._id;
        this.router.navigate([{ outlets: { primary: url, nav: mode } }]);
      }
    } else if (mode == 'model') {
      if (this._modelService.selectedModel) {
        var url = 'model/' + this._modelService.selectedModel;
        this.router.navigate([{ outlets: { primary: url, nav: mode } }]);
      }
    } else if (mode == 'config') {
      this.ready = true;
      this.readyChange.emit(this.ready);
    }
  }
}
