import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { ConnectionMask } from '../../../components/connection/connectionMask';

import { AppService } from '../../../services/app/app.service';


@Component({
  selector: 'app-connection-mask',
  templateUrl: './connection-mask.component.html',
  styleUrls: ['./connection-mask.component.scss']
})
export class ConnectionMaskComponent implements OnInit {
  @Input() mask: ConnectionMask;
  public showPlot: boolean = false;
  public maskOptions: any = [
    { value: 'none', label: 'none' },
    { value: 'rectangular', label: 'rectangular' },
    { value: 'circular', label: 'circular' },
    { value: 'doughnut', label: 'doughnut' },
    { value: 'elliptical', label: 'elliptical' }
  ];

  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private _appService: AppService,
  ) { }

  ngOnInit() {
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

}
