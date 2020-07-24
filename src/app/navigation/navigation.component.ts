import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MdePopoverTrigger } from '@material-extended/mde';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router, ActivatedRoute } from '@angular/router';

import { AppService } from '../app.service';
import { NavigationService } from './navigation.service';
import { ModelService } from '../model/model.service';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    public _appService: AppService,
    public _modelService: ModelService,
    public _navigationService: NavigationService,
    public router: Router,
  ) {
  }

  ngOnInit() {
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
    if (mode === '') {
      this.router.navigate([{ outlets: { primary: null, nav: null } }]);
      this._navigationService.sidenavOpened = false;
    } else {
      const url: string = window.location.href;
      const isActivated: boolean = url.includes('nav:' + mode);
      setTimeout(() => {
        this._navigationService.sidenavOpened = !isActivated || !this._navigationService.sidenavOpened;
      }, 10)
      const nav: string = this.isNavLoaded(mode) ? null : mode;
      // if (mode === 'project' && this._appService.data.project.id !== undefined) {
      //   const url: string = 'project/' + this._appService.data.project.id;
      //   this.router.navigate([{ outlets: { primary: url, nav: nav } }]);
      // } else if (mode === 'model' && this._modelService.selectedModel) {
      //   const url: string = 'model/' + this._modelService.selectedModel;
      //   this.router.navigate([{ outlets: { primary: url, nav: nav } }]);
      // }
    }
  }
}
