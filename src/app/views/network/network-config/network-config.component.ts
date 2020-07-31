import { Component, OnInit } from '@angular/core';

import { ColorSchemes } from '../../../components/network/colorSchemes';

import { AppService } from '../../../services/app/app.service';


@Component({
  selector: 'app-network-config',
  templateUrl: './network-config.component.html',
  styleUrls: ['./network-config.component.scss']
})
export class NetworkConfigComponent implements OnInit {
  colorSchemes: ColorSchemes;

  constructor(
    private _appService: AppService,
  ) {
    this.colorSchemes = new ColorSchemes();
   }

  ngOnInit() {
  }

  get color(): any {
    return this._appService.data.project.network.config.data.color;
  }

  selectColor(idx: number, color: string): void {
    this.color.scheme = '';
    this.color.cycle[idx] = color;
  }

  selectScheme(event: any): void {
    this.color.cycle = Array.apply([], this.colorSchemes.config.data[event.value]);
  }

}
