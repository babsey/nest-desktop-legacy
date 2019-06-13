import { Component, OnInit } from '@angular/core';

import { AppConfigService } from './app-config.service';
import { ColorService } from '../../services/color/color.service';


@Component({
  selector: 'app-app-config',
  templateUrl: './app-config.component.html',
  styleUrls: ['./app-config.component.css']
})
export class AppConfigComponent implements OnInit {
  public host: any;

  constructor(
    public _appConfigService: AppConfigService,
    public _colorService: ColorService,
  ) { }

  ngOnInit() {
    this.host = this._appConfigService.urlRoot();
  }

  onChange(event) {
    this._appConfigService.config.app[event.option.value] = event.option.selected;
    this._appConfigService.save()
  }

  saveAndCheck() {
    this._appConfigService.save()
    this._appConfigService.check()
  }

  selectColor(idx, color) {
    this._appConfigService.config.color.scheme = '';
    this._appConfigService.config.color.cycle[idx] = color;
    this._appConfigService.save()
  }

  selectScheme(event) {
    this._appConfigService.config.color.cycle = Array.apply([], this._colorService.schemes[event.value]);
    this._appConfigService.save()
  }

}
