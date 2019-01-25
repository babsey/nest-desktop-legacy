import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';

import { ConfigService } from '../../config/config.service';
import { ControllerService } from '../controller.service';
import { DataService } from '../../services/data/data.service';
import { SketchService } from '../../sketch/sketch.service';
import { SimulationService } from '../../simulation/simulation.service';


@Component({
  selector: 'app-controller-sheet',
  templateUrl: './controller-sheet.component.html',
  styleUrls: ['./controller-sheet.component.css']
})
export class ControllerSheetComponent implements OnInit {
  private data: any;
  public viewSketch: any = false;


  constructor(
    private _simulationService: SimulationService,
    public _configService: ConfigService,
    public _controllerService: ControllerService,
    public _dataService: DataService,
    public _sketchService: SketchService,
    public bottomSheetRef: MatBottomSheetRef<ControllerSheetComponent>,
  ) { }

  ngOnInit() {
    // console.log('Init controller sheet');
  }

  run() {
    this._simulationService.run(true)
  }

  toggleNetworkSketchView() {
    this.viewSketch = !this.viewSketch;
  }

  edit() {
    // console.log('Draw Network sketch')
    this._sketchService.resetMouseVars()
    this._controllerService.options.edit = !this._controllerService.options.edit;
  }

  undo() {
    this._dataService.undo()
    setTimeout(() => this._sketchService.update.emit(), 100)
    this._simulationService.run()
  }

  redo() {
    this._dataService.redo()
    setTimeout(() => this._sketchService.update.emit(), 100)
    this._simulationService.run()
  }

  delete() {
    // console.log('Network sketch sheet delete')
    this._sketchService.resetMouseVars()
    this._controllerService.options.edit = true;
    this._dataService.history(this._dataService.data)
    this._dataService.records = [];
    this._dataService.data.connectomes = [];
    this._dataService.data.collections = [];
    this._sketchService.update.emit()
  }

  close() {
    // console.log('Network sketch sheet close')
    this._controllerService.options.edit = false;
    this._controllerService.options.sheetOpened = false;
    this.bottomSheetRef.dismiss()
  }

  onClick(key1, key2) {
    this._configService.config.app[key1][key2] = !this._configService.config.app[key1][key2]
    this._configService.save('app', this._configService.config.app)
  }
}
