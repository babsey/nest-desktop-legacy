import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MdePopoverTrigger } from '@material-extended/mde';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router, ActivatedRoute } from '@angular/router';

import { AppService } from '../../services/app/app.service';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor(
    private _route: ActivatedRoute,
    public appService: AppService,
    public router: Router,
  ) {
  }

  ngOnInit() {
    this.appService.sidenavOpened = this.isNavLoaded();
  }

  isNavLoaded(mode: string = ''): boolean {
    return window.location.href.includes('nav:' + mode)
  }

  onClick(event: MouseEvent, mode: string = ''): void {
    if (this.isNavLoaded(mode) || (mode && !this.appService.sidenavOpened)) {
      this.appService.toggleSidenav();
    }
    if (this.appService.sidenavOpened && mode) {
      this.router.navigate([{ outlets: { nav: mode } }]);
    } else if (mode) {
      this.router.navigate([{ outlets: { nav: null } }]);
    } else {
      this.router.navigate([{ outlets: { primary: null, nav: null } }]);
    }
  }
}
