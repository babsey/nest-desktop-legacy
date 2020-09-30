import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../../services/app/app.service';
import { LogService } from '../../services/log/log.service';


@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

  constructor(
    private _appService: AppService,
    private _logService: LogService,
    private _router: Router,
  ) { }

  ngOnInit() {
  }

  get config(): any {
    return this._appService.app.config;
  }

  get logs(): any[] {
    return this._logService.logs;
  }

  get router(): Router {
    return this._router;
  }

  get time(): Date {
    return this._logService.time;
  }

  setTime(time: Date): void {
    this._logService.time = time;
  }

  isTime(time: Date): boolean {
    return this._logService.time === time;
  }

}
