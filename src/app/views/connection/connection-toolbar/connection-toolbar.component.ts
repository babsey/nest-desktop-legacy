import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { Connection } from '../../../components/connection/connection';


@Component({
  selector: 'app-connection-toolbar',
  templateUrl: './connection-toolbar.component.html',
  styleUrls: ['./connection-toolbar.component.scss']
})
export class ConnectionToolbarComponent implements OnInit {
  @Input() connection: Connection;
  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  private _contextMenuPosition = { x: '0px', y: '0px' };

  constructor() {
  }

  ngOnInit() {
  }

  get contextMenuPosition(): any {
    return this._contextMenuPosition;
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this._contextMenuPosition.x = event.clientX + 'px';
    this._contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }
}
