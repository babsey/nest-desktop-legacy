import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material';

import { NetworkSketchSheetComponent } from '../network/network-sketch-sheet/network-sketch-sheet.component';

import { DataService } from '../services/data/data.service';
import { AnimationControllerService } from '../visualization/visualization-controller/animation-controller/animation-controller.service';
import { RecordsVisualizationService } from '../visualization/records-visualization/records-visualization.service';
import { SimulationProtocolService } from './services/simulation-protocol.service';
import { SimulationRunService } from './services/simulation-run.service';
import { SimulationService } from './services/simulation.service';

import { Data } from '../classes/data';


@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit, OnDestroy {
  public data: Data;
  public records: any[] = [];
  public mode: string = 'network';

  constructor(
    private bottomSheet: MatBottomSheet,
    private _animationControllerService: AnimationControllerService,
    private _recordsVisualizationService: RecordsVisualizationService,
    private _simulationProtocolService: SimulationProtocolService,
    private _simulationRunService: SimulationRunService,
    private _simulationService: SimulationService,
    private route: ActivatedRoute,
    private router: Router,
    public _dataService: DataService,
  ) { }

  ngOnInit() {
    this.data = this._dataService.emptyData();
    // console.log('Init simulation')
    this.route.params.subscribe(params => this.init(params['id']));
    this._simulationRunService.simulated.subscribe(data => this.update(data))
  }

  ngOnDestroy() {
    this.bottomSheet.dismiss()
  }


  init(id) {
    if (id) {
      this._simulationService.load(id).then(doc => {
        this.data = this._dataService.clean(doc);
        if (this.router.url.includes('run')) {
          this._dataService.mode = 'run';
        }
        if (this._dataService.mode == 'run') {
          this._simulationRunService.run(this.data, true)
        }
      })
    } else if (this.data == undefined) {
      this.data = this._dataService.emptyData();
      this._dataService.mode = 'edit';
    }
  }

  update(data) {
    this.data.app.kernel.time = data.kernel.time;
    data.collections.map((collection, idx) => {
      this.data.app.nodes[idx]['global_ids'] = collection.global_ids;
      let params = this.data.simulation.models[collection.model].params;
      if ('record_from' in params) {
        this.data.app.nodes[idx]['record_from'] = params.record_from;
      }
      if ('spatial' in collection) {
        this.data.app.nodes[idx]['positions'] = collection.spatial.positions;
      }
    })
    this._animationControllerService.init();
    this.records = data.records;
  }

  save() {
    this._simulationProtocolService.save(this.data)
  }

  edit() {
    this._dataService.mode = 'edit';
    this.bottomSheet.dismiss()
  }

  details() {
    this._dataService.mode = 'details';
    this.bottomSheet.dismiss()
  }

  run() {
    if (this._dataService.mode == 'run') {
      this._simulationRunService.run(this.data, true)
    }
    this._dataService.mode = 'run';
  }

  isBottomSheetOpened() {
    return this.bottomSheet._openedBottomSheetRef != null;
  }

  closeBottomSheet() {
    this.bottomSheet.dismiss()
  }

  openBottomSheet() {
    this.bottomSheet.open(NetworkSketchSheetComponent, {
      data: this.data,
      autoFocus: false,
      hasBackdrop: false,
      disableClose: true,
    });
  }

  toggleBottomSheet() {
    if (this.isBottomSheetOpened()) {
      this.closeBottomSheet()
    } else {
      this.openBottomSheet()
    }
  }

  onNetworkChange(data) {
    // console.log('On network change')
    this.records = [];
    this._dataService.validate(this.data);
  }

  onSimulationChange(data, force=false) {
    // console.log('On simulation change')
    this._dataService.validate(data);
    if (this._dataService.mode == 'run') {
      this._simulationRunService.run(data, force)
    }
  }

  onAppChange(data) {
    // console.log('On app change')
    this._recordsVisualizationService.init.emit()
  }

}
