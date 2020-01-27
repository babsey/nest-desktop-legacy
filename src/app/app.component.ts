import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

import { LoadingService } from './loading/loading.service';
import { NavigationService } from './navigation/navigation.service';
import { AppConfigService } from './config/app-config/app-config.service';
import { AppService } from './app.service';
import { routeNavAnimation, routeAnimation } from './animations/route-animation';


import * as math from 'mathjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    routeNavAnimation,
    routeAnimation,
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('content', { static: false }) content: ElementRef;
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    public _appConfigService: AppConfigService,
    public _appService: AppService,
    public _navigationService: NavigationService,
    public _loadingService: LoadingService,
    public router: Router,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1023px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this._loadingService.init()
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  advanced(): boolean {
    return this._appConfigService.config.app['advanced'];
  }

  prepareRoute(outlet: RouterOutlet): void {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  triggerResize(): void {
    if (!this.mobileQuery.matches) {
      window.dispatchEvent(new Event('resize'));
    }
  }

}
