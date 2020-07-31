import { Component, OnInit } from '@angular/core';

import { AppConfigService } from '../../../services/app/app-config.service';


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

  onSelectionChange(event: any): void {
    this._appConfigService.config.app[event.option.value] = event.option.selected;
    this._appConfigService.save()
  }

  onChange(event: any): void {
    this._appConfigService.save()
  }

}
