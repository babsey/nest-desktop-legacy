import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { AnimationControllerService } from '../visualization/animation/animation-controller/animation-controller.service';
import { DataService } from '../services/data/data.service';
import { NetworkService } from '../network/services/network.service';
import { SimulationEventService } from './services/simulation-event.service';
import { SimulationRunService } from './services/simulation-run.service';
import { SimulationService } from './services/simulation.service';

import { Data } from '../classes/data';
import { Record } from '../classes/record';

import { enterAnimation } from '../animations/enter-animation';


@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss'],
  animations: [ enterAnimation ],
})
export class SimulationComponent implements OnInit, OnDestroy {

  constructor(
    private _animationControllerService: AnimationControllerService,
    private _dataService: DataService,
    private _networkService: NetworkService,
    private bottomSheet: MatBottomSheet,
    private route: ActivatedRoute,
    private router: Router,
    public _simulationEventService: SimulationEventService,
    public _simulationRunService: SimulationRunService,
    public _simulationService: SimulationService,
  ) {
  }

  ngOnInit(): void {
    // console.log('Init simulation')
    this.route.params.subscribe(params => this.init(params['id']));
  }

  ngOnDestroy(): void {
    this.bottomSheet.dismiss()
  }

  init(id: string): void {
    this._simulationService.dataLoaded = false;
    this._simulationEventService.records = [];
    if (id) {
      this._simulationService.load(id).then(doc => {
        this._simulationService.data = this._dataService.clean(doc);
        this._networkService.clean(this._simulationService.data);
        this._networkService.update.emit(this._simulationService.data);
        this._simulationService.dataLoaded = true;
        if (this.router.url.includes('run')) {
          this._simulationService.mode = 'activityExplorer';
        }
        if (this._simulationService.mode == 'activityExplorer' && this._simulationRunService.config['runAfterLoad']) {
          this.run(true)
        }
      })
    } else {
      this._simulationService.data = this._dataService.newData();
      this._simulationService.mode = 'networkEditor';
      this._simulationService.dataLoaded = true;
    }
  }

  run(force: boolean = false): void {
    this._simulationService.mode = 'activityExplorer';
    this._animationControllerService.stop();
    if (this._networkService.recorderChanged) {
      this._simulationEventService.records = [];
      this._networkService.recorderChanged = false;
    }
    this._networkService.clean(this._simulationService.data);
    this._simulationRunService.run(this._simulationService.data, force)
  }

  onDataChange(data: Data): void {
    // console.log('Simulation on data change')
    this._simulationService.data._id = '';
  }

}
