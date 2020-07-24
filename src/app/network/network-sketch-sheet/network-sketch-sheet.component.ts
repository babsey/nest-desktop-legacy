import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { NetworkService } from '../services/network.service';

import { Project } from '../../components/project';


@Component({
  selector: 'app-network-sketch-sheet',
  templateUrl: './network-sketch-sheet.component.html',
  styleUrls: ['./network-sketch-sheet.component.scss']
})
export class NetworkSketchSheetComponent implements OnInit, OnDestroy {
  private subscription: any;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public project: Project,
    private _changeDetectorRef: ChangeDetectorRef,
    private _networkService: NetworkService,
    public bottomSheetRef: MatBottomSheetRef<NetworkSketchSheetComponent>,
  ) {
  }

  ngOnInit() {
    this.subscription = this._networkService.update.subscribe((project: Project) => {
      this.project = project;
      this._changeDetectorRef.markForCheck()
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
