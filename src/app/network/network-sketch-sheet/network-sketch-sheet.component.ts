import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';

import { NetworkService } from '../services/network.service';

import { Data } from '../../classes/data';


@Component({
  selector: 'app-network-sketch-sheet',
  templateUrl: './network-sketch-sheet.component.html',
  styleUrls: ['./network-sketch-sheet.component.scss']
})
export class NetworkSketchSheetComponent implements OnInit, OnDestroy {
  private subscription: any;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: Data,
    private _changeDetectorRef: ChangeDetectorRef,
    private _networkService: NetworkService,
    public bottomSheetRef: MatBottomSheetRef<NetworkSketchSheetComponent>,
  ) {
  }

  ngOnInit(): void {
    this.subscription = this._networkService.update.subscribe((data: Data) => {
      this.data = data;
      this._changeDetectorRef.markForCheck()
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
