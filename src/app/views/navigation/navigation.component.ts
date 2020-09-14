import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MdePopoverTrigger } from '@material-extended/mde';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router, ActivatedRoute } from '@angular/router';

import { App } from '../../components/app';

import { AppService } from '../../services/app/app.service';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor(
    private _appService: AppService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) { }

  ngOnInit() {
    this._appService.sidenavOpened = this.isNavLoaded();
  }

  get app(): App {
    return this._appService.app;
  }

  isNavLoaded(mode: string = ''): boolean {
    return window.location.href.includes('nav:' + mode);
  }

  isSidenavOpened(): boolean {
    return this._appService.sidenavOpened;
  }

  toggleSidenav(): void {
    this._appService.toggleSidenav();
  }

  onClick(event: MouseEvent, mode: string = ''): void {
    if (this.isNavLoaded(mode) || (mode && !this._appService.sidenavOpened)) {
      this._appService.toggleSidenav();
    }
    if (this._appService.sidenavOpened && mode) {
      this._router.navigate([{ outlets: { nav: mode } }]);
    } else if (mode) {
      this._router.navigate([{ outlets: { nav: null } }]);
    } else {
      this._router.navigate([{ outlets: { primary: null, nav: null } }]);
    }
  }
}
