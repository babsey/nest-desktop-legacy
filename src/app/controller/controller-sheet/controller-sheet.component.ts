import { Component, ChangeDetectorRef } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';

import { AppConfigService } from '../../config/app-config/app-config.service';
import { ControllerConfigService } from '../../config/controller-config/controller-config.service';
import { DataService } from '../../services/data/data.service';
import { ChartService } from '../../chart/chart.service';
import { ControllerService } from '../controller.service';
import { NetworkSimulationService } from '../../network/network-simulation/network-simulation.service';
import { SketchService } from '../../sketch/sketch.service';


@Component({
  selector: 'app-controller-sheet',
  templateUrl: './controller-sheet.component.html',
  styleUrls: ['./controller-sheet.component.css']
})
export class ControllerSheetComponent {

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    public _networkSimulationService: NetworkSimulationService,
    public _appConfigService: AppConfigService,
    public _controllerConfigService: ControllerConfigService,
    public _dataService: DataService,
    public _controllerService: ControllerService,
    public _chartService: ChartService,
    public _sketchService: SketchService,
    public bottomSheetRef: MatBottomSheetRef<ControllerSheetComponent>,
  ) {
    this._sketchService.update.subscribe(() => this._changeDetectorRef.markForCheck());
  }

  run() {
    this._sketchService.draw(false);
    this._networkSimulationService.run(true)
  }

  undo() {
    this._dataService.undo()
    setTimeout(() => this._sketchService.update.emit(), 100)
    this._networkSimulationService.run()
  }

  redo() {
    this._dataService.redo()
    setTimeout(() => this._sketchService.update.emit(), 100)
    this._networkSimulationService.run()
  }

  delete() {
    if (this._sketchService.selected.node) {
      var idx = this._sketchService.selected.node.idx;
      this._dataService.deleteNode(idx)
    } else if (this._sketchService.selected.link) {
      var idx = this._sketchService.selected.link.idx;
      this._dataService.deleteLink(idx)
    }
    this._sketchService.resetMouseVars()
    this._sketchService.update.emit()
  }

  clear() {
    // console.log('Network sketch sheet delete')
    this._sketchService.draw(true);
    this._dataService.history(this._dataService.data)
    this._dataService.records = [];
    this._dataService.data.connectomes = [];
    this._dataService.data.collections = [];
    this._sketchService.update.emit()
  }

  close() {
    // console.log('Network sketch sheet close')
    this._sketchService.draw(false);
    this.bottomSheetRef.dismiss()
    this._controllerService.closeBottomSheet()
  }

  toggleSketchShow() {
    this._controllerConfigService.config.showSketch = !this._controllerConfigService.config.showSketch;
    this._controllerConfigService.save()
  }
}
