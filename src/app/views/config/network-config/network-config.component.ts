import { Component, OnInit } from '@angular/core';

import { ConfigService } from '../../../components/config';
import { ColorSchemes } from '../../../components/network/colorSchemes';


@Component({
  selector: 'app-network-config',
  templateUrl: './network-config.component.html',
  styleUrls: ['./network-config.component.scss']
})
export class NetworkConfigComponent implements OnInit {
  private _config: ConfigService;
  public colorSchemes: ColorSchemes;

  constructor(
  ) {
    this._config = new ConfigService('Network');
    this.colorSchemes = new ColorSchemes();
   }

  ngOnInit() {
  }

  get config(): any {
    return this._config.data;
  }

  set config(value: any) {
    this._config.update(value);
  }

  selectColor(idx: number, color: string): void {
    let config: any = this.config;
    config.color.scheme = '';
    config.color.cycle[idx] = color;
    this._config.data = config;
  }

  selectScheme(event: any): void {
    let config: any = this.config;
    config.color.cycle = Array.apply([], this.colorSchemes.config[event.value]);
    this._config.data = config;
  }

}
