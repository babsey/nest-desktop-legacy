import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatBottomSheet, MatMenuTrigger } from '@angular/material';
import { MdePopoverTrigger } from '@material-extended/mde';

import { AppService } from '../../app.service';
import { SimulationService } from '../../simulation/services/simulation.service';

import { Data } from '../../classes/data';

import { listAnimation } from '../../animations/list-animation';


@Component({
  selector: 'app-simulation-list',
  templateUrl: './simulation-list.component.html',
  styleUrls: ['./simulation-list.component.scss'],
  animations: [ listAnimation ],
})
export class SimulationListComponent implements OnInit {
  @Input() quickview: boolean = false;
  @Input() simulations: Data[];
  @Output() select: EventEmitter<any> = new EventEmitter();
  public focused: Data;

  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private _appService: AppService,
    public _simulationService: SimulationService,
  ) {
  }

  ngOnInit() {
    // console.log('Simulation list')
  }

  selected(simulation: Data): boolean {
    if (this._simulationService.data == undefined) return false;
    return simulation._id == this._simulationService.data._id;
  }

  view(simulation: Data, ref: MdePopoverTrigger): void {
    if (!this.quickview) return
    this._appService.rightClick = true
    // this.focused = simulation;
    ref.openPopover();
  }

  disabled(): boolean {
    if (!this.focused) return
    return this.focused['source'] == 'simulation';
  }

  deleteSimulation(): void {
    this.select.emit({ mode: 'delete', selected: [this.focused['_id']] })
  }

  downloadSimulation(): void {
    this.select.emit({ mode: 'download', selected: [this.focused['_id']] })
  }

  onMouseOut(event: MouseEvent): void {
    this._appService.rightClick = false;
    // this.selected = null;
  }

  onContextMenu(event: MouseEvent, simulation: Data): void {
    event.preventDefault();
    this.focused = simulation;
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

  onClick(simulation: Data): void {
    if (!simulation.hasOwnProperty('_id')) return
    this.select.emit({mode: 'navigate', id: simulation._id})
  }

}
