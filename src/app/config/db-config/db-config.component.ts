import { Component, OnInit } from '@angular/core';

import { DBConfigService } from './db-config.service';


@Component({
  selector: 'app-db-config',
  templateUrl: './db-config.component.html',
  styleUrls: ['./db-config.component.scss']
})
export class DBConfigComponent implements OnInit {

  constructor(
    public _dbConfigService: DBConfigService,
  ) { }

  ngOnInit() {
  }

  saveDB() {
    this._dbConfigService.save()
  }

}
