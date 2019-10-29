import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { NavigationService } from './navigation/navigation.service';
import { AppConfigService } from './config/app-config/app-config.service';
import { AppService } from './app.service';


import * as math from 'mathjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public mobileQuery: MediaQueryList;
  @ViewChild('content', { static: false }) content: ElementRef;
  public ready: boolean = false;
  public buttonDisplay: string = '0.2';

  private _mobileQueryListener: () => void;


  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    public _appConfigService: AppConfigService,
    public _appService: AppService,
    public _navigationService: NavigationService,
    public router: Router,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    window['math'] = math;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  onReady(ready: boolean): void {
    this.ready = ready;
  }

  navigationWidth(): string {
    return this._navigationService.sidenavShortView ? '40px' : '260px';
  }

  toggleNavigationOpened(): void {
    this.buttonDisplay = '0.2';
    this._navigationService.sidenavShortView = !this._navigationService.sidenavShortView
  }

  isNavigationOpened(): boolean {
    return !this._navigationService.sidenavShortView && this._navigationService.sidenavOpened;
  }

  advanced(): boolean {
    return this._appConfigService.config.app['advanced'];
  }

}
