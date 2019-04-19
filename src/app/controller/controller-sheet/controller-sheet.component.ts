import { Component, ChangeDetectorRef } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';

import { DataService } from '../../services/data/data.service';
import { SketchService } from '../../sketch/sketch.service';


@Component({
  selector: 'app-controller-sheet',
  templateUrl: './controller-sheet.component.html',
  styleUrls: ['./controller-sheet.component.css']
})
export class ControllerSheetComponent {

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _sketchService: SketchService,
    public _dataService: DataService,
    public bottomSheetRef: MatBottomSheetRef<ControllerSheetComponent>,
  ) {
    this._sketchService.update.subscribe(() => this._changeDetectorRef.markForCheck());
  }

}
