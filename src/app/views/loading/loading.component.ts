import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { App } from '../../components/app';

import { AppService } from '../../services/app/app.service';


@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  constructor(
    private _appService: AppService,
    private _router: Router,
  ) { }

  ngOnInit() {
  }

  get app(): App {
    return this._appService.app;
  }

  get router(): Router {
    return this._router;
  }

  onClick(event: MouseEvent): void {
    setTimeout(() => {
      const nav: string | null = window.location.href.includes('nav:') ?  null : 'app';
      this.router.navigate([{ outlets: { primary: null, nav: nav } }]);
      this._appService.toggleSidenav();
    }, 10);
  }

}
