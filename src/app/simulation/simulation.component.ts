import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatBottomSheet, MatMenuTrigger } from '@angular/material';

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

import { enterAnimation } from '../animations/enter-animation';


@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss'],
  animations: [ enterAnimation ],
})
export class SimulationComponent implements OnInit, OnDestroy {

  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private _animationControllerService: AnimationControllerService,
    private _appService: AppService,
    private _colorService: ColorService,
    private _dataService: DataService,
    private _networkService: NetworkService,
    private _simulationProtocolService: SimulationProtocolService,
    private bottomSheet: MatBottomSheet,
    private route: ActivatedRoute,
    private router: Router,
    public _simulationControllerService: SimulationControllerService,
    public _simulationEventService: SimulationEventService,
    public _simulationRunService: SimulationRunService,
    public _simulationService: SimulationService,
    public _visualizationService: VisualizationService,
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
          this._simulationService.mode = 'playground';
        }
        if (this._simulationService.mode == 'playground' && this._simulationRunService.config['runAfterLoad']) {
          this.run(true)
        }
      })
    } else {
      this._simulationService.data = this._dataService.newData();
      this._simulationService.mode = 'edit';
      this._simulationService.dataLoaded = true;
    }
  }

  run(force: boolean = false): void {
    this._simulationService.mode = 'playground';
    this._networkService.clean(this._simulationService.data);
    this._simulationRunService.run(this._simulationService.data, force)
  }

  hasRecords(): boolean {
    return this._simulationEventService.records.length > 0;
  }

  download(): void {
    var data = this._dataService.clean(this._simulationService.data);
    if (this._simulationEventService.records.length > 0) {
      data['records'] = this._simulationEventService.records;
    }
    this._simulationProtocolService.download([data])
  }

  configSimulation(): void {
    this._simulationService.mode = 'playground';
    this._simulationControllerService.mode = 'simulation';
  }

  onDataChange(data: Data): void {
    // console.log('Simulation on data change')
    this._simulationService.data._id = '';
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
