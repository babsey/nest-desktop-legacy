import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatBottomSheet, MatMenuTrigger } from '@angular/material';

import { NetworkSketchSheetComponent } from '../network/network-sketch-sheet/network-sketch-sheet.component';

import { AnimationControllerService } from '../visualization/animation/animation-controller/animation-controller.service';
import { AppService } from '../app.service';
import { ColorService } from '../network/services/color.service';
import { DataService } from '../services/data/data.service';
import { NetworkService } from '../network/services/network.service';
import { VisualizationService } from '../visualization/visualization.service';
import { SimulationControllerService } from './simulation-controller/simulation-controller.service';
import { SimulationProtocolService } from './services/simulation-protocol.service';
import { SimulationEventService } from './services/simulation-event.service';
import { SimulationRunService } from './services/simulation-run.service';
import { SimulationService } from './services/simulation.service';

import { Data } from '../classes/data';
import { Record } from '../classes/record';


@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit, OnDestroy {
  public data: any = {};
  public records: Record[] = [];

  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private _animationControllerService: AnimationControllerService,
    private _appService: AppService,
    private _colorService: ColorService,
    private _dataService: DataService,
    private _networkService: NetworkService,
    private _simulationEventService: SimulationEventService,
    private _simulationProtocolService: SimulationProtocolService,
    private bottomSheet: MatBottomSheet,
    private route: ActivatedRoute,
    private router: Router,
    public _simulationControllerService: SimulationControllerService,
    public _simulationRunService: SimulationRunService,
    public _simulationService: SimulationService,
    public _visualizationService: VisualizationService,
  ) {
  }

  ngOnInit() {
    // console.log('Init simulation')
    this.route.params.subscribe(params => this.init(params['id']));
    this._simulationRunService.simulated.subscribe(resData => this.update(resData))
  }

  ngOnDestroy() {
    this.bottomSheet.dismiss()
  }

  init(id: string): void {
    this.data = {}
    this.records = [];
    this._simulationEventService.records = [];
    if (id) {
      this._simulationService.load(id).then(doc => {
        this.data = this._dataService.clean(doc);
        this._networkService.validate(this.data);
        this._networkService.update.emit(this.data);
        if (this.router.url.includes('run')) {
          this._simulationService.mode = 'run';
        }
        if (this._simulationService.mode == 'run' && this._simulationRunService.config['runAfterLoad']) {
          this.run(true)
        }
      })
    } else {
      this.data = this._dataService.newData();
      this._simulationService.mode = 'edit';
    }
  }

  update(resData: any): void {
    // Update kernel time
    this.data.app.kernel.time = resData.kernel.time;

    // Update global ids, record_from, positions
    resData.collections.map((collection, idx) => {
      this.data.app.nodes[idx]['global_ids'] = collection.global_ids;
      let params = this.data.simulation.models[collection.model].params;
      if (params.hasOwnProperty('record_from')) {
        this.data.app.nodes[idx]['record_from'] = params.record_from;
      }
      if (collection.hasOwnProperty('spatial')) {
        this.data.app.nodes[idx]['positions'] = collection.spatial.positions;
      }
    })

    // Update records
    resData.records.map((rec, i) => {
      if (i < this.records.length) {
        var record = this.records[i];
        record['events'] = rec.events;
        record['global_ids'] = rec.global_ids;
        record['senders'] = rec.senders;
      } else {
        rec['config'] = {};
        this.records.push(rec);
        var record = this.records[this.records.length - 1];
      }
      record['positions'] = this._networkService.getPositionsForRecord(this.data, rec);
      record.recorder['color'] = this._colorService.node(this.data.app.nodes[record.recorder.idx]);
    })

    this._simulationEventService.records = this.records;
    this._visualizationService.time = resData.kernel.time;
    this._visualizationService.checkPositions(this.records);
    this._visualizationService.mode = this.data.app.visualization || 'chart';
    this._visualizationService.update.emit()
  }

  save(): void {
    this.data.app.visualization = this._visualizationService.mode || 'chart';
    this._simulationProtocolService.save(this.data)
  }

  edit(): void {
    this._simulationService.mode = 'edit';
    this.bottomSheet.dismiss()
  }

  details(): void {
    this._simulationService.mode = 'details';
    this.bottomSheet.dismiss()
  }

  run(force: boolean = false): void {
    this._animationControllerService.stop();
    if (this._networkService.recorderChanged) {
      this.records = [];
      this._networkService.recorderChanged = false;
    }
    this._networkService.validate(this.data);
    if (this._simulationService.mode == 'run') {
      this._simulationRunService.run(this.data, force)
    }
    this._simulationService.mode = 'run';
  }

  hasRecords(): boolean {
    return this.records.length > 0;
  }

  download(): void {
    var data = this._dataService.clean(this.data);
    if (this.hasRecords()) {
      data['records'] = this.records;
    }
    this._simulationProtocolService.download([data])
  }

  selectVisualizationModus(mode: string): void {
    if (this._visualizationService.mode == mode) {
      this._simulationControllerService.mode = mode
    } else {
      if (this._simulationControllerService.mode == 'chart') {
        this._simulationControllerService.mode = 'animation';
      } else if (this._simulationControllerService.mode == 'animation') {
        this._simulationControllerService.mode = 'chart';
      }
    }
    this._visualizationService.mode = mode;
    this._visualizationService.update.emit()
  }

  selectControllerMode(mode: string): void {
    this._simulationControllerService.mode = mode;
  }

  isBottomSheetOpened(): boolean {
    return this.bottomSheet._openedBottomSheetRef != null;
  }

  closeBottomSheet(): void {
    this.bottomSheet.dismiss()
  }

  openBottomSheet(): void {
    this.bottomSheet.open(NetworkSketchSheetComponent, {
      data: this.data,
      autoFocus: false,
      hasBackdrop: false,
      disableClose: true,
    });
  }

  toggleBottomSheet(): void {
    if (this.isBottomSheetOpened()) {
      this.closeBottomSheet()
    } else {
      this.openBottomSheet()
    }
  }

  configSimulation(): void {
    this._simulationService.mode = 'run';
    this._simulationControllerService.mode = 'simulation';
  }

  onDataChange(data: Data): void {
    // console.log('Simulation on data change')
    this.data._id = '';
    setTimeout(() => this.run(), 1)
  }

  onAppChange(records: Record[]): void {
    // console.log('On app change')
    this._visualizationService.update.emit()
  }

  onSelectionChange(event: any): void {
    this._simulationRunService.config[event.option.value] = event.option.selected;
    this._simulationRunService.saveConfig()
  }

  onMouseOver(event: MouseEvent): void {
    this._appService.rightClick = true;
  }

  onMouseOut(event: MouseEvent): void {
    this._appService.rightClick = false;
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

}
