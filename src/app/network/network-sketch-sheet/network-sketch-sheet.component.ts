import { Component, ChangeDetectorRef, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';

import { Data } from '../../classes/data';


@Component({
  selector: 'app-network-sketch-sheet',
  templateUrl: './network-sketch-sheet.component.html',
  styleUrls: ['./network-sketch-sheet.component.scss']
})
export class NetworkSketchSheetComponent {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: Data,
    public bottomSheetRef: MatBottomSheetRef<NetworkSketchSheetComponent>,
  ) {
  }

}
