import { Component, OnInit } from '@angular/core';

import { ConfigService } from './config.service';


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  constructor(
    public _configService: ConfigService,
  ) { }

  ngOnInit() {
    this._configService.init()
    this._configService.check()
  }

  save() {
    this._configService.save('app', this._configService.config.app)
  }

  saveAndCheck() {
    this.save()
    this._configService.check()
  }
}
