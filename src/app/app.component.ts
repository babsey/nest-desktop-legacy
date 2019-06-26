import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'

import { ChartService } from './chart/chart.service';
import { ControllerService } from './controller/controller.service';
import { NavigationService } from './navigation/navigation.service';
import { AppConfigService } from './config/app-config/app-config.service';
import { NetworkSimulationService } from './network/network-simulation/network-simulation.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('content', {static: false}) content: ElementRef;
  public ready: boolean = false;
  public buttonDisplay: string = '0.2';

  constructor(
    private _chartService: ChartService,
    private _controllerService: ControllerService,
    private _navigationService: NavigationService,
    private _networkSimulationService: NetworkSimulationService,
    public _appConfigService: AppConfigService,
  ) {
  }

  ngOnInit() {
  }

  onReady(event) {
    this.ready = event;
  }

  isOpened() {
    return this._navigationService.options.sidenavOpened;
  }

  onClose() {
    this._navigationService.options.sidenavOpened = false;
  }

  navigationWidth() {
    return this._navigationService.options.sidenavShortView ? '40px' : '260px';
  }

  toggleNavigationOpened() {
    this.buttonDisplay = '0.2';
    this._navigationService.options.sidenavShortView = !this._navigationService.options.sidenavShortView
    this._navigationService.options.sidenavOpened = true;
    setTimeout(() => this._networkSimulationService.resize.emit(), 500)
  }

  isNavigationOpened() {
    return !this._navigationService.options.sidenavShortView && this._navigationService.options.sidenavOpened;
  }

  resize() {
    this._networkSimulationService.resize.emit()
  }

}
