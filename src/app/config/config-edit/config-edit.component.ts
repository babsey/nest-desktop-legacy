import { Component, OnInit } from '@angular/core';

import { ConfigService } from '../config.service';

@Component({
  selector: 'app-config-edit',
  templateUrl: './config-edit.component.html',
  styleUrls: ['./config-edit.component.css']
})
export class ConfigEditComponent implements OnInit {

  constructor(
    public _configService: ConfigService,
) { }

  ngOnInit() {
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
