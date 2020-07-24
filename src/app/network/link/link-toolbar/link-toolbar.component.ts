import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { MatMenuTrigger } from '@angular/material/menu';

import { AppService } from '../../../app.service';

import { Connection } from '../../../components/connection';


@Component({
  selector: 'app-link-toolbar',
  templateUrl: './link-toolbar.component.html',
  styleUrls: ['./link-toolbar.component.scss']
})
export class LinkToolbarComponent implements OnInit {
  @Input() connection: Connection;

  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private _appService: AppService,
  ) { }

  ngOnInit() {
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
