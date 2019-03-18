import { Component, OnInit, ViewChild } from '@angular/core'

import { ChartService } from './chart/chart.service';
import { ControllerService } from './controller/controller.service';
import { NavigationService } from './navigation/navigation.service';
import { AppConfigService } from './config/app-config/app-config.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('content') content: any;
  public ready: boolean = false;
  public buttonDisplay: string = '0.2';

  constructor(
    private _chartService: ChartService,
    private _controllerService: ControllerService,
    private _navigationService: NavigationService,
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

  onChange() {
    var width = this.content.elementRef.nativeElement.clientWidth - (this._controllerService.options.sidenavOpened ? 380 : 0);
    var height = this.content.elementRef.nativeElement.clientHeight;
    this._chartService.resize(width, height);
  }

  toggleNavigationOpened() {
    this.buttonDisplay = '0.2';
    this._navigationService.options.sidenavOpened = !this._navigationService.options.sidenavOpened;
  }

  isNavigationOpened() {
    return this._navigationService.options.sidenavOpened;
  }

}
