import { Component, OnInit } from '@angular/core';

import { NESTServer } from '../../../components/nestServer';

import { AppService } from '../../../services/app/app.service';


@Component({
  selector: 'app-nest-server-config',
  templateUrl: './nest-server-config.component.html',
  styleUrls: ['./nest-server-config.component.scss']
})
export class NestServerConfigComponent implements OnInit {

  constructor(
    private _appService: AppService,
  ) { }

  ngOnInit() {
  }

  get nestServer(): NESTServer {
    return this._appService.data.nestServer;
  }

}
