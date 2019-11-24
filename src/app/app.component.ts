import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

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
  @ViewChild('content', { static: false }) content: ElementRef;
  public mobileQuery: MediaQueryList;
  public ready: boolean = false;
  private _mobileQueryListener: () => void;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    public _appConfigService: AppConfigService,
    public _appService: AppService,
    public _navigationService: NavigationService,
    public router: Router,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1023px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    if (window.location.href.includes('.hbp.eu')) {
      this.resolveAuthOpenidcSession()
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  getCookie(name: string): string {
    var cookie = document.cookie;
    var prefix = name + "=";
    var begin = cookie.indexOf("; " + prefix);
    if (begin == -1) {
      begin = cookie.indexOf(prefix);
      if (begin != 0) return null;
    }
    else {
      begin += 2;
      var end = document.cookie.indexOf(";", begin);
      if (end == -1) {
        end = cookie.length;
      }
    }
    // because unescape has been deprecated, replaced with decodeURI
    //return unescape(dc.substring(begin + prefix.length, end));
    return decodeURI(cookie.substring(begin + prefix.length, end));
  }

  resolveAuthOpenidcSession(): void {
    var myCookie = this.getCookie("mod_auth_openidc_session");
    if (myCookie == null) {
      window.location.reload();
    }
  }

  onReady(ready: boolean): void {
    this.ready = ready;
  }

  advanced(): boolean {
    return this._appConfigService.config.app['advanced'];
  }

  triggerResize(): void {
    if (!this.mobileQuery.matches) {
      window.dispatchEvent(new Event('resize'));
    }
  }

}
