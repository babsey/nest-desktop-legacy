import { Component, OnInit } from '@angular/core';

import { ColorService } from '../services/color.service';
import { NetworkConfigService } from '../network-config/network-config.service';


@Component({
  selector: 'app-network-sketch-controller',
  templateUrl: './network-sketch-controller.component.html',
  styleUrls: ['./network-sketch-controller.component.scss']
})
export class NetworkSketchControllerComponent implements OnInit {

  constructor(
    public _colorService: ColorService,
    public _networkConfigService: NetworkConfigService,
  ) { }

  ngOnInit() {
  }

  selectScheme(event: any): void {
    this._networkConfigService.config.color.cycle = Array.apply([], this._colorService.schemes[event.value]);
    this._networkConfigService.save()
  }

  selectColor(idx: number, color: string): void {
    this._networkConfigService.config.color.scheme = '';
    this._networkConfigService.config.color.cycle[idx] = color;
    this._networkConfigService.save()
  }

  onValueChange(value: any): void {
    this._networkConfigService.save()
  }
}
