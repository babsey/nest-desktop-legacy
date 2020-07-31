import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import * as d3 from 'd3';

import { Connection } from '../../../components/connection/connection';
import { Network } from '../../../components/network/network';
import { Node } from '../../../components/node/node';

import { AppService } from '../../../services/app/app.service';
import { NetworkSketchService } from '../../../services/network/network-sketch.service';

import { NetworkClearDialogComponent } from '../network-clear-dialog/network-clear-dialog.component';


@Component({
  selector: 'app-network-sketch',
  templateUrl: './network-sketch.component.html',
  styleUrls: ['./network-sketch.component.scss']
})
export class NetworkSketchComponent implements OnInit {
  @Input() network: Network;
  @Input() width: number = 600;
  @Input() height: number = 400;
  @Input() eventTrigger: boolean = true;
  private selector: any;

  public contextMenuData: any = { node: null, connection: null };
  public contextMenuPosition: any = { x: '0px', y: '0px' };
  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;

  constructor(
    private _appService: AppService,
    private _networkSketchService: NetworkSketchService,
    private elementRef: ElementRef,
    private dialog: MatDialog,
  ) {
    this.selector = d3.select(elementRef.nativeElement);
  }

  ngOnInit() {
    // console.log('Init network sketch')
    // this.history()
    d3.select('body').on('keyup', () => {
      if (d3.event.keyCode === '27') {
        this.selector.selectAll('.select').remove();
        this.network.view.resetSelection();
      }
      this._networkSketchService.keyDown = '';
    }).on('keydown', () => {
      this._networkSketchService.keyDown = d3.event.keyCode;
    })
  }

  onSVGEnter(event: MouseEvent): void {
    if (!this.eventTrigger) return
    this._appService.rightClick = true;
    this._networkSketchService.viewDragline = true;
  }

  onSVGOver(event: MouseEvent): void {
    this._networkSketchService.viewDragline = true;
  }

  onSVGLeave(event: MouseEvent): void {
    this._appService.rightClick = false;
    this.network.view.resetFocus();
    this._networkSketchService.viewDragline = false;
  }

  onNodeEnter(event: MouseEvent, node: Node): void {
    node.view.focus();
    const nodeSelected = this.network.view.selectedNode;
    if (this.eventTrigger && nodeSelected) {
      const color: string = nodeSelected.view.color;
      this._networkSketchService.connect = true;
      this._networkSketchService.dragLine(nodeSelected.view.position, node.view.position, color);
    }
  }

  onContextMenu(event: MouseEvent, node: Node, connection: Connection): void {
    if (!this.eventTrigger) return
    event.preventDefault();
    this.network.view.resetFocus();
    this.network.view.resetSelection();
    if (!this.eventTrigger) return
    this.contextMenuData.node = node;
    this.contextMenuData.connection = connection;
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

}
