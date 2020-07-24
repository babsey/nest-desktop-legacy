import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../app.service';
import { LoadingService } from './loading.service';
import { NavigationService } from '../navigation/navigation.service';


@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  constructor(
    public _appService: AppService,
    public _loadingService: LoadingService,
    public _navigationService: NavigationService,
    public router: Router,
  ) { }

  ngOnInit() {
  }

  onClick(event: MouseEvent): void {
    setTimeout(() => {
      var nav = window.location.href.includes('nav:') ?  null : 'app';
      this.router.navigate([{ outlets: { primary: null, nav: nav } }]);
      this._navigationService.sidenavOpened = !this._navigationService.sidenavOpened;
    }, 10)
  }

}
