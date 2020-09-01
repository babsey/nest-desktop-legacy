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
  public colorSchemes: ColorSchemes;

  constructor(
  ) {
    this._config = new Config('Network');
    this.colorSchemes = new ColorSchemes();
   }

  ngOnInit() {
  }

  get config(): any {
    return this._config.data;
  }

  selectColor(idx: number, color: string): void {
    let config: any = this.config;
    config.color.scheme = '';
    config.color.cycle[idx] = color;
    this._config.data = config;
  }

  selectScheme(event: any): void {
    let config: any = this.config;
    config.color.cycle = Array.apply([], this.colorSchemes.config.data[event.value]);
    this.config.data = config;
  }

}
