import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';

import { ConfigService } from '../../config/config.service';
import { ControllerService } from '../controller.service';
import { DataService } from '../../services/data/data.service';
import { NavigationService } from '../../navigation/navigation.service';
import { ProtocolService } from '../../services/protocol/protocol.service';
import { SketchService } from '../../sketch/sketch.service';
import { SimulationService } from '../../simulation/simulation.service';

import {
  faBars,
  faCheck,
  faEllipsisV,
  faPencilAlt,
  faPlayCircle,
  faRedoAlt,
  faSave,
  faShareAlt,
  faSlidersH,
  faTimes,
  faTrashAlt,
  faUndoAlt,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-controller-sheet',
  templateUrl: './controller-sheet.component.html',
  styleUrls: ['./controller-sheet.component.css']
})
export class ControllerSheetComponent implements OnInit {
  private data: any;
  public viewSketch: any = false;

  public faBars = faBars;
  public faCheck = faCheck;
  public faEllipsisV = faEllipsisV;
  public faPencilAlt = faPencilAlt;
  public faPlayCircle = faPlayCircle;
  public faRedoAlt = faRedoAlt;
  public faSave = faSave;
  public faShareAlt = faShareAlt;
  public faSlidersH = faSlidersH;
  public faTimes = faTimes;
  public faTrashAlt = faTrashAlt;
  public faUndoAlt = faUndoAlt;

  constructor(
    private _protocolService: ProtocolService,
    private _simulationService: SimulationService,
    public _configService: ConfigService,
    public _controllerService: ControllerService,
    public _dataService: DataService,
    public _navigationService: NavigationService,
    public _sketchService: SketchService,
    public bottomSheetRef: MatBottomSheetRef<ControllerSheetComponent>,
  ) { }

  ngOnInit() {
    // console.log('Init controller sheet');
  }


  toggleList() {
    this._navigationService.options.sidenavListOpened = !this._navigationService.options.sidenavListOpened;
  }

  run() {
    this._simulationService.run(true)
  }

  save() {
    // console.log('Save protocol')
    this._controllerService.options.edit = false;
    this._protocolService.save(this._dataService.data)
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
