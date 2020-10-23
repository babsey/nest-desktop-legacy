import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { select } from 'd3-selection';

import { Connection } from '../../../components/connection/connection';
import { Network } from '../../../components/network/network';
import { Node } from '../../../components/node/node';

import { NetworkGraphService } from '../../../services/network/network-graph.service';


@Component({
  selector: 'app-network-graph',
  templateUrl: './network-graph.component.html',
  styleUrls: ['./network-graph.component.scss']
})
export class NetworkGraphComponent implements OnInit {
  @Input() eventTrigger = true;
  @Input() height = 400;
  @Input() network: Network;
  @Input() width = 600;
  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  private _contextMenuData: any = { node: null, connection: null };
  private _contextMenuPosition: any = { x: '0px', y: '0px' };
  private _selector: any;
  private _viewDragline: boolean;

  constructor(
    private _dialog: MatDialog,
    private _elementRef: ElementRef,
    private _networkGraphService: NetworkGraphService,
  ) {
    this._selector = select(_elementRef.nativeElement);
  }

  ngOnInit() {
    // console.log('Init network graph')
    // this.history()
    select('body').on('keyup', (event: any) => {
      if (event.keyCode === '27') {
        this._selector.selectAll('.select').remove();
        this.network.view.resetSelection();
      }
      this._networkGraphService.keyDown = '';
    }).on('keydown', (event: any) => {
      this._networkGraphService.keyDown = event.keyCode;
    });
  }

  get contextMenuPosition(): any {
    return this._contextMenuPosition;
  }

  get contextMenuData(): any {
    return this._contextMenuData;
  }

  get viewDragline(): boolean {
    return this._viewDragline;
  }

  countBefore(): number {
    return this.network.project.networkRevisionIdx;
  }

  countAfter(): number {
    return (
      this.network.project.networkRevisions.length -
      this.network.project.networkRevisionIdx -
      1
    );
  }

  onSVGEnter(event: MouseEvent): void {
    if (!this.eventTrigger) { return; }
    this._viewDragline = true;
  }

  onSVGOver(event: MouseEvent): void {
    this._viewDragline = true;
  }

  onSVGLeave(event: MouseEvent): void {
    this.network.view.resetFocus();
    this._viewDragline = false;
  }

  onNodeEnter(event: MouseEvent, node: Node): void {
    node.view.focus();
    const nodeSelected = this.network.view.selectedNode;
    if (this.eventTrigger && nodeSelected) {
      const color: string = nodeSelected.view.color;
      this._networkGraphService.connect = true;
      this._networkGraphService.dragLine(
        nodeSelected.view.position,
        node.view.position,
        color
      );
    }
  }

  onContextMenu(event: MouseEvent, node: Node, connection: Connection): void {
    if (!this.eventTrigger) { return; }
    event.preventDefault();
    this.network.view.resetFocus();
    this.network.view.resetSelection();
    if (!this.eventTrigger) { return; }
    this._contextMenuData.node = node;
    this._contextMenuData.connection = connection;
    this._contextMenuPosition.x = event.clientX + 'px';
    this._contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

}
