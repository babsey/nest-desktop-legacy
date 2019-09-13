import { Component, OnInit } from '@angular/core';

import { NetworkConfigService } from './network-config.service';
import { ColorService } from '../services/color.service';


@Component({
  selector: 'app-network-config',
  templateUrl: './network-config.component.html',
  styleUrls: ['./network-config.component.scss']
})
export class NetworkConfigComponent implements OnInit {

  constructor(
    public _networkConfigService: NetworkConfigService,
    public _colorService: ColorService,
  ) { }

  ngOnInit() {
  }

  onChange(event) {
    this._networkConfigService.config.app[event.option.value] = event.option.selected;
    this._networkConfigService.save()
  }

  selectColor(idx, color) {
    this._networkConfigService.config.color.scheme = '';
    this._networkConfigService.config.color.cycle[idx] = color;
    this._networkConfigService.save()
  }

  selectScheme(event) {
    this._networkConfigService.config.color.cycle = Array.apply([], this._colorService.schemes[event.value]);
    this._networkConfigService.save()
  }

}
