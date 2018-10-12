import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import { MatSnackBar } from '@angular/material';

import {
  faDownload,
  faEllipsisV,
  faPen,
  faPlayCircle,
  faSearch,
  faShareAlt,
  faPencilAlt,
  faBars,
  faTimes,
  faCog,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

import * as objectHash from 'object-hash';

import { ControllerService } from '../shared/services/controller/controller.service';
import { DataService } from '../shared/services/data/data.service';
import { NetworkService } from '../shared/services/network/network.service';
import { ProtocolService } from '../shared/services/protocol/protocol.service';
import { SimulationService } from '../shared/services/simulation/simulation.service';
import { SketchService } from '../shared/services/sketch/sketch.service';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  private snackBarRef: any;
  public options: any;
  public protocols: any = [];
  public filteredProtocols: any = [];

  public faDownload = faDownload;
  public faEllipsisV = faEllipsisV;
  public faPen = faPen;
  public faPlayCircle = faPlayCircle;
  public faSearch = faSearch;
  public faShareAlt = faShareAlt;
  public faTimes = faTimes;
  public faBars = faBars;
  public faCog = faCog;
  public faPencilAlt = faPencilAlt;
  public faChartLine = faChartLine;

  constructor(
    public router: Router,
    public _controllerService: ControllerService,
    public _dataService: DataService,
    public _networkService: NetworkService,
    public _protocolService: ProtocolService,
    public _simulationService: SimulationService,
    public _sketchService: SketchService,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this._protocolService.list(this);
  }

  toggleController() {
    this._controllerService.options.opened = !this._controllerService.options.opened;
  }

  toggleSketch() {
    this._sketchService.options.show = !this._sketchService.options.show;
  }

  editSketch(mode=null) {
    var data = this._dataService.data;
    this._sketchService.options.drawing = mode != null ? mode : !this._sketchService.options.drawing
    this._sketchService.resetMouseVars()
    if (this._sketchService.options.drawing) {
      this.snackBarRef = this.snackBar.open("The editing mode is on.", 'Close');
      this.snackBarRef.onAction().subscribe(() => this.editSketch(false));
    } else {
      var objHash = objectHash(data)
      if (objHash != data.hash) {
        data.hash = objHash;
      }
      if (this.snackBarRef) {
        this.snackBarRef.dismiss();
      }
      this._dataService.ready = true;
    }
  }

  runSimulation() {
    this._simulationService.run()
  }

  saveProtocol() {
    this._protocolService.save(this._dataService.data);
  }

  listProtocols() {
    this._protocolService.list(this);
  }

  clearProtocols() {
    this._protocolService.searchTerm = '';
    this._protocolService.filter(this);
  }

  search(query: string) {
    this._protocolService.searchTerm = query;
    this._protocolService.filter(this);
  }

  viewProtocol(popover, doc) {
    popover.open({doc});
  }

  loadProtocol(id) {
    this._protocolService.load(this._dataService, id).then(() => {
      this._sketchService.update.emit()
      this._controllerService.update.emit()
      this._dataService.ready = true;
      this._simulationService.run()
    })
  }

}
