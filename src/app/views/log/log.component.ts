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
    public _logService: LogService,
    public _appService: AppService,
    public router: Router,
  ) { }

  ngOnInit() {
  }

  get config(): any {
    return this._appService.data.config.data;
  }

  setTime(time: Date): void {
    this._logService.time == time;
  }

  isTime(time: Date): boolean {
    return this._logService.time === time
  }

}
