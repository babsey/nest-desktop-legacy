import { Component, OnInit } from '@angular/core';

import { NestServerConfigService } from './nest-server-config.service';
import { NestServerService } from '../nest-server.service';


@Component({
  selector: 'app-nest-server-config',
  templateUrl: './nest-server-config.component.html',
  styleUrls: ['./nest-server-config.component.scss']
})
export class NestServerConfigComponent implements OnInit {
  public host: string;

  constructor(
    public _nestServerConfigService: NestServerConfigService,
    public _nestServerService: NestServerService,
  ) { }

  ngOnInit() {
    this._nestServerConfigService.init()
    this.host = this._nestServerService.url();
  }

  save(): void {
    this._nestServerConfigService.save()
    this.host = this._nestServerService.url();
    this._nestServerService.check()
  }

  onSelectionChange(event: any): void {
    this._nestServerConfigService.config[event.option.value] = event.option.selected;
    this.save()
  }
}
