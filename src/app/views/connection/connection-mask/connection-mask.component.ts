import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { ConnectionMask } from '../../../components/connection/connectionMask';



@Component({
  selector: 'app-connection-mask',
  templateUrl: './connection-mask.component.html',
  styleUrls: ['./connection-mask.component.scss']
})
export class ConnectionMaskComponent implements OnInit {
  @Input() mask: ConnectionMask;
  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  private _contextMenuPosition = { x: '0px', y: '0px' };
  private _options: any[];
  private _showPlot = false;

  constructor() {
    this._options = [
      { value: 'none', label: 'none' },
      { value: 'rectangular', label: 'rectangular' },
      { value: 'circular', label: 'circular' },
      { value: 'doughnut', label: 'doughnut' },
      { value: 'elliptical', label: 'elliptical' }
    ];
  }

  ngOnInit() {
  }

  get contextMenuPosition(): any {
    return this._contextMenuPosition;
  }

  get options(): any {
    return this._options;
  }

  get showPlot(): boolean {
    return this._showPlot;
  }

  set showPlot(value: boolean) {
    this._showPlot = value;
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this._contextMenuPosition.x = event.clientX + 'px';
    this._contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

}
