import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { Network } from '../../../components/network/network';

import { AppService } from '../../../services/app/app.service';


@Component({
  selector: 'app-network-sketch-sheet',
  templateUrl: './network-sketch-sheet.component.html',
  styleUrls: ['./network-sketch-sheet.component.scss']
})
export class NetworkSketchSheetComponent implements OnInit {

  constructor(
    private _appService: AppService,
    private _bottomSheetRef: MatBottomSheetRef<NetworkSketchSheetComponent>,
  ) { }

  ngOnInit() {
  }

  get network(): Network {
    return this._appService.app.project.network;
  }

  dismiss(): void {
    this._bottomSheetRef.dismiss();
  }

}
