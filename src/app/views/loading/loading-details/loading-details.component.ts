import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { Router } from '@angular/router';

import { enterAnimation } from '../../../animations/enter-animation';

import { App } from '../../../components/app';
import { Config } from '../../../components/config';

import { AppService } from '../../../services/app/app.service';


@Component({
  selector: 'app-loading-details',
  templateUrl: './loading-details.component.html',
  styleUrls: ['./loading-details.component.scss'],
  animations: [enterAnimation],
})
export class LoadingDetailsComponent implements OnInit {
  public configs: any[];

  constructor(
    private _appService: AppService,
    private _router: Router,
  ) { }

  ngOnInit() {
    this.configs = [
      { name: 'Application', source: new Config('App') },
      { name: 'NEST Server', source: new Config('NESTServer') },
      { name: 'Project', source: new Config('Project') },
      { name: 'Network', source: new Config('Network') },
      { name: 'Simulation', source: new Config('Simulation') },
    ];
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
