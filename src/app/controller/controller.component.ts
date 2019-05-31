import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { Router } from '@angular/router';

import { ControllerSheetComponent } from './controller-sheet/controller-sheet.component';

import { AppConfigService } from '../config/app-config/app-config.service';
import { ChartService } from '../chart/chart.service';
import { ControllerConfigService } from '../config/controller-config/controller-config.service';
import { ControllerService } from './controller.service';
import { DataService } from '../services/data/data.service';
import { NetworkSimulationService } from '../network/network-simulation/network-simulation.service';
import { NetworkProtocolService } from '../network/network-protocol/network-protocol.service';
import { SketchService } from '../sketch/sketch.service';


@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.css'],
})
export class ControllerComponent implements OnInit, OnDestroy {
  public showNetwork: boolean = true;

  constructor(
    private _appConfigService: AppConfigService,
    private _chartService: ChartService,
    private _controllerConfigService: ControllerConfigService,
    private _networkProtocolService: NetworkProtocolService,
    private _sketchService: SketchService,
    private bottomSheet: MatBottomSheet,
    public _controllerService: ControllerService,
    public _dataService: DataService,
    public _networkSimulationService: NetworkSimulationService,
    public router: Router,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.bottomSheet.dismiss()
  }

  setLevel(event) {
    this._controllerConfigService.config.level = event.option.selected ? parseInt(event.option.value) : -1;
    this._controllerConfigService.save()
  }

  getLevel() {
    let level = this._controllerConfigService.config.level;
    return level;
  }

  isLevel(level) {
    return this._controllerConfigService.config.level == level;
  }

  toggleType(element_type) {
    this._sketchService.selected.node = null;
    this._controllerService.selected = this._controllerService.selected == element_type ? null : element_type;
    this._sketchService.update.emit()
  }

  isSelected(element_type) {
    return this._controllerService.selected == null || this._controllerService.selected == element_type;
  }

  onChange() {
    this._sketchService.update.emit()
    this._chartService.init.emit()
    if (!this._dataService.options.edit) {
      this._networkSimulationService.run()
    }
  }

  isBottomSheetOpened() {
    return this.bottomSheet._openedBottomSheetRef != null;
  }

  closeBottomSheet() {
    this.bottomSheet.dismiss()
    this._controllerService.closeBottomSheet()
  }

  openBottomSheet() {
    this.bottomSheet.open(ControllerSheetComponent, {
      autoFocus: false,
      hasBackdrop: false,
      disableClose: true,
    });
    this._controllerService.openBottomSheet()
  }

  toggleBottomSheet() {
    if (this.isBottomSheetOpened()) {
      this.closeBottomSheet()
    } else {
      this.openBottomSheet()
    }
  }

  details() {
    this.router.navigate([{ outlets: { primary: 'network/' + this._dataService.data._id } }])
  }

  run() {
    if (this._sketchService.options.drawing) {
      this._sketchService.draw(false);
    }
    this._networkSimulationService.run(true)
  }

  saveProtocol() {
    this._networkProtocolService.save(this._dataService.data)
  }

}
