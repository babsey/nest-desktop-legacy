import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { Router } from '@angular/router';

import { enterAnimation } from '../../../animations/enter-animation';

import { App } from '../../../components/app';

import { AppService } from '../../../services/app/app.service';


@Component({
  selector: 'app-loading-details',
  templateUrl: './loading-details.component.html',
  styleUrls: ['./loading-details.component.scss'],
  animations: [enterAnimation],
})
export class LoadingDetailsComponent implements OnInit {

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

  get state(): any {
    return this._appService.app.nestServer.state;
  }

}
