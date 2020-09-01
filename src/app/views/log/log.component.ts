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
    public logService: LogService,
    public appService: AppService,
    public router: Router,
  ) { }

  ngOnInit() {
  }

  get config(): any {
    return this.appService.app.config;
  }

  setTime(time: Date): void {
    this.logService.time === time;
  }

  isTime(time: Date): boolean {
    return this.logService.time === time
  }

}
