import { Component, OnInit } from '@angular/core';

import { AppConfigService } from './app-config.service';


@Component({
  selector: 'app-app-config',
  templateUrl: './app-config.component.html',
  styleUrls: ['./app-config.component.scss']
})
export class AppConfigComponent implements OnInit {
  public host: any;

  constructor(
    public _appConfigService: AppConfigService,
  ) { }

  ngOnInit() {
    this._appConfigService.init()
  }

  onSelectionChange(event) {
    this._appConfigService.config.app[event.option.value] = event.option.selected;
    this._appConfigService.save()
  }

  onChange(event) {
    this._appConfigService.save()
  }


}
