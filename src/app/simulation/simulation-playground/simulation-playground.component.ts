import { ChangeDetectorRef, Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { MediaMatcher } from '@angular/cdk/layout';

import { NetworkSketchSheetComponent } from '../../network/network-sketch-sheet/network-sketch-sheet.component';

import { AnimationControllerService } from '../../visualization/animation/animation-controller/animation-controller.service';
import { ColorService } from '../../network/services/color.service';
import { NetworkService } from '../../network/services/network.service';
import { VisualizationService } from '../../visualization/visualization.service';
import { SimulationControllerService } from '../simulation-controller/simulation-controller.service';
import { SimulationEventService } from '../services/simulation-event.service';
import { SimulationRunService } from '../services/simulation-run.service';
import { SimulationService } from '../services/simulation.service';

import { Data } from '../../classes/data';
import { Record } from '../../classes/record';


@Component({
  selector: 'app-simulation-playground',
  templateUrl: './simulation-playground.component.html',
  styleUrls: ['./simulation-playground.component.scss']
})
export class SimulationPlaygroundComponent implements OnInit, OnDestroy {
  @Input() data: Data;
  @Input() records: Record[] = [];
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  @Output() recordsChange: EventEmitter<any> = new EventEmitter();
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  private subscription: any;

  constructor(
    private _animationControllerService: AnimationControllerService,
    private _colorService: ColorService,
    private _networkService: NetworkService,
    private _simulationEventService: SimulationEventService,
    private _simulationRunService: SimulationRunService,
    private bottomSheet: MatBottomSheet,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    public _simulationControllerService: SimulationControllerService,
    public _simulationService: SimulationService,
    public _visualizationService: VisualizationService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1023px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    // console.log('Init simulation playgound')
    this.subscription = this._simulationRunService.simulated.subscribe(resData => this.update(resData))
  }

  ngOnDestroy() {
    // console.log('Destroy simulation playgound')
    this.subscription.unsubscribe()
    this.bottomSheet.dismiss()
  }

  update(resData: any): void {
    // Update kernel time
    // console.log(this.data._id)
    this.data.app.kernel.time = resData.kernel.time;

    // Update global ids, record_from, positions
    resData.collections.map((collection, idx) => {
      var node = this.data.app.nodes[idx];
      if (node == undefined) return
      node['global_ids'] = collection.global_ids;
      let params = this.data.simulation.models[collection.model].params;
      if (params.hasOwnProperty('record_from')) {
        node['record_from'] = params.record_from;
      } else {
        delete node['record_from']
      }
      if (collection.hasOwnProperty('spatial')) {
        node['positions'] = collection.spatial.positions;
      } else {
        delete node['positions']
      }
    })

    // Update records
    var records = this.records;
    resData.records.map((rec, i) => {
      if (i < records.length) {
        var record = records[i];
        record['events'] = rec.events;
        record['global_ids'] = rec.global_ids;
        record['senders'] = rec.senders;
      } else {
        rec['config'] = {};
        records.push(rec);
        var record = records[records.length - 1];
      }
      record['positions'] = this._networkService.getPositionsForRecord(this.data, rec);
      record.recorder['color'] = this._colorService.node(this.data.app.nodes[record.recorder.idx]);
    })
    this._visualizationService.checkPositions(records);
    // this.records = records;

    this._visualizationService.time = resData.kernel.time;
    if (['animation','chart'].includes(this._simulationControllerService.mode)) {
      this._simulationControllerService.mode = this._visualizationService.mode;
    }
    this._visualizationService.update.emit()
  }

  run(force: boolean = false): void {
    this._animationControllerService.stop();
    if (this._networkService.recorderChanged) {
      this.records = [];
      this._networkService.recorderChanged = false;
    }
    this._networkService.clean(this.data);
    this._simulationRunService.run(this.data, force)
  }

  selectControllerMode(mode: string): void {
    if (this._simulationControllerService.mode == mode) {
      this._simulationService.sidenavOpened = !this._simulationService.sidenavOpened;
    } else {
      this._simulationControllerService.mode = mode;
      this._simulationService.sidenavOpened = true;
    }
  }

  toggleSidenav(): void {
    this._simulationService.sidenavOpened = !this._simulationService.sidenavOpened;
  }

  toggleQuickView(): void {
    this._networkService.quickView = !this._networkService.quickView;
  }

  isQuickViewOpened(): boolean {
    return this._networkService.quickView;
  }

  triggerResize(): void {
    window.dispatchEvent(new Event('resize'));
  }

  onDataChange(data: Data): void {
    console.log('Simulation on data change')
    this.dataChange.emit(this.data)
    setTimeout(() => this.run(), 1)
  }

  onAppChange(records: Record[]): void {
    // console.log('On app change')
    this._visualizationService.update.emit()
  }

}
