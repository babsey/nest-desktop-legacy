import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatBottomSheet, MatMenuTrigger } from '@angular/material';
import { MdePopoverTrigger } from '@material-extended/mde';

import { AppService } from '../../app.service';
import { Data } from '../../classes/data';


@Component({
  selector: 'app-simulation-list',
  templateUrl: './simulation-list.component.html',
  styleUrls: ['./simulation-list.component.scss']
})
export class SimulationListComponent implements OnInit {
  @Input() popover: boolean = false;
  @Input() simulations: Data[];
  @Output() select: EventEmitter<any> = new EventEmitter();
  public selected: Data;
  public viewPopup: boolean = false;

  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private _appService: AppService,
  ) {
  }

  ngOnInit() {
    // console.log('Simulation list')
  }

  view(simulation: Data, ref: MdePopoverTrigger): void {
    this._appService.rightClick = true
    if (this.popover) {
      this.selected = simulation;
      ref.openPopover();
    } else {
      ref.closePopover()
    }
  }

  disabled(): boolean {
    if (!this.selected) return
    return this.selected['source'] == 'simulation';
  }

  deleteSimulation(): void {
    this.select.emit({ mode: 'delete', selected: [this.selected['_id']] })
  }

  downloadSimulation(): void {
    this.select.emit({ mode: 'download', selected: [this.selected['_id']] })
  }

  onMouseOut(event: MouseEvent): void {
    this._appService.rightClick = false;
  }

  onContextMenu(event: MouseEvent, simulation: Data): void {
    event.preventDefault();
    this.selected = simulation;
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

}
