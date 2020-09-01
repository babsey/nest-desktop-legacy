import { Component, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { Network } from '../../../components/network/network';

import { AppService } from '../../../services/app/app.service';


@Component({
  selector: 'app-network-sketch-sheet',
  templateUrl: './network-sketch-sheet.component.html',
  styleUrls: ['./network-sketch-sheet.component.scss']
})
export class NetworkSketchSheetComponent implements OnInit {
  private _subscription: any;

  constructor(
    private _appService: AppService,
    public bottomSheetRef: MatBottomSheetRef<NetworkSketchSheetComponent>,
  ) {
  }

  ngOnInit() {
  }

  get network(): Network {
    return this._appService.app.project.network;
  }

}
