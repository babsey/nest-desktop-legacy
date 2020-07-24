import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../app.service';
import { LogService } from './log.service';


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

  setTime(time: Date): void {
    this._logService.time == time;
  }

  isTime(time: Date): boolean {
    return this._logService.time === time
  }

}
