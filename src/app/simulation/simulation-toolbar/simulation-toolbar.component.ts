import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { AppService } from '../../app.service';
import { DataService } from '../../services/data/data.service';
import { NetworkService } from '../../network/services/network.service';
import { SimulationEventService } from '../services/simulation-event.service';
import { SimulationProtocolService } from '../services/simulation-protocol.service';
import { SimulationRunService } from '../services/simulation-run.service';
import { SimulationService } from '../services/simulation.service';

import { Data } from '../../classes/data';

import { enterAnimation } from '../../animations/enter-animation';


@Component({
  selector: 'app-simulation-toolbar',
  templateUrl: './simulation-toolbar.component.html',
  styleUrls: ['./simulation-toolbar.component.scss'],
  animations: [ enterAnimation ],
})
export class SimulationToolbarComponent implements OnInit {
  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private _appService: AppService,
    private _dataService: DataService,
    private _networkService: NetworkService,
    private _simulationEventService: SimulationEventService,
    private _simulationProtocolService: SimulationProtocolService,
    public _simulationRunService: SimulationRunService,
    public _simulationService: SimulationService,
  ) { }

  ngOnInit() {
  }

  selectMode(mode: string): void {
    this._simulationService.mode = mode;
    this._simulationService.sidenavOpened = mode != 'networkDetails';
    setTimeout(() => this.triggerResize(), 10)
  }

  triggerResize(): void {
    window.dispatchEvent(new Event('resize'));
  }

  run(force: boolean = false): void {
    this._simulationService.mode = 'activityExplorer';
    this._networkService.clean(this._simulationService.data);
    this._simulationRunService.run(this._simulationService.data, force)
  }

  configSimulation(): void {
    this._simulationService.mode = 'activityExplorer';
    this._simulationService.sidenavMode = 'simulation';
  }

  hasRecords(): boolean {
    return this._simulationEventService.records.length > 0;
  }

  download(): void {
    const data: Data = this._dataService.clean(this._simulationService.data);
    if (this._simulationEventService.records.length > 0) {
      data['records'] = this._simulationEventService.records;
    }
    this._simulationProtocolService.download([data])
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
