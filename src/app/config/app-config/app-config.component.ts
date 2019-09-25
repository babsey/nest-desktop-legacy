import { Component, OnInit } from '@angular/core';

import { AppConfigService } from './app-config.service';
import { NestServerService } from '../../services/nest-server/nest-server.service';


@Component({
  selector: 'app-app-config',
  templateUrl: './app-config.component.html',
  styleUrls: ['./app-config.component.scss']
})
export class AppConfigComponent implements OnInit {
  public host: any;

  constructor(
    public _appConfigService: AppConfigService,
    public _nestServerService: NestServerService,
  ) { }

  ngOnInit() {
    this.host = this._appConfigService.urlRoot();
  }

  onSelectionChange(event) {
    this._appConfigService.config.app[event.option.value] = event.option.selected;
    this._appConfigService.save()
  }

  onChange(event) {
    this._appConfigService.save()
  }

  saveAndCheck() {
    this._appConfigService.save()
    this.host = this._appConfigService.urlRoot();
    this._nestServerService.check(this.host)
  }

}
