import { Component, OnInit } from '@angular/core';

import { ConfigService } from './config.service';
import { ColorService } from '../services/color/color.service';


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  public selectedColor:any = 0;

  constructor(
    public _configService: ConfigService,
    public _colorService: ColorService,
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

  selectColor(idx, color) {
    this._configService.config.app.colors[idx] = color;
    this.save()
  }

  selectScheme(event) {
    this._colorService.selectedScheme = event.value;
    this._colorService.colors = this._colorService.schemes[event.value];
    this._configService.config.app.colors = this._colorService.colors;
    this.save()
  }

}
