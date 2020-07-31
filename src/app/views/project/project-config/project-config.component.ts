import { Component, OnInit } from '@angular/core';

import { AppService } from '../../../services/app/app.service';


@Component({
  selector: 'app-project-config',
  templateUrl: './project-config.component.html',
  styleUrls: ['./project-config.component.scss']
})
export class ProjectConfigComponent implements OnInit {

  constructor(
    private _appService: AppService,
  ) { }

  ngOnInit() {
  }

  get config(): any {
    return this._appService.data.config.data;
  }

}
