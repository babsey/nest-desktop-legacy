import { Component, OnInit } from '@angular/core';

import { Config } from '../../../components/config';
import { ColorSchemes } from '../../../components/network/colorSchemes';


@Component({
  selector: 'app-network-config',
  templateUrl: './network-config.component.html',
  styleUrls: ['./network-config.component.scss']
})
export class NetworkConfigComponent implements OnInit {
  private _config: Config;
  private _colorSchemes: ColorSchemes;

  constructor() {
    this._config = new Config('Network');
    this._colorSchemes = new ColorSchemes();
  }

  ngOnInit() {
  }

  get colorSchemes(): ColorSchemes {
    return this._colorSchemes;
  }

  get config(): any {
    return this._config.config;
  }

  set config(value: any) {
    this._config.updateConfig(value);
  }

  selectColor(idx: number, color: string): void {
    const config: any = this.config;
    config.color.scheme = '';
    config.color.cycle[idx] = color;
    this._config.config = config;
  }

  selectScheme(event: any): void {
    const config: any = this.config;
    config.color.cycle = Array.apply([], this.colorSchemes.config[event.value]);
    this._config.config = config;
  }

}
