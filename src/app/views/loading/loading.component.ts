import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../../services/app/app.service';


@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  constructor(
    public appService: AppService,
    public router: Router,
  ) { }

  ngOnInit() {
  }

  onClick(event: MouseEvent): void {
    setTimeout(() => {
      const nav: string | null = window.location.href.includes('nav:') ?  null : 'app';
      this.router.navigate([{ outlets: { primary: null, nav: nav } }]);
      this.appService.toggleSidenav();
    }, 10)
  }

}
