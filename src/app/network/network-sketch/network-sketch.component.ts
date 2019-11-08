import { Component, OnInit, Input, ElementRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog, MatMenuTrigger } from '@angular/material';
import * as d3 from 'd3';

import { AppService } from '../../app.service';
import { ColorService } from '../services/color.service';
import { DataService } from '../../services/data/data.service';
import { NetworkService } from '../services/network.service';
import { NetworkSketchService } from './network-sketch.service';

import { NetworkClearDialogComponent } from '../network-clear-dialog/network-clear-dialog.component';

import { Data } from '../../classes/data';
import { AppNode } from '../../classes/appNode';
import { AppLink } from '../../classes/appLink';


@Component({
  selector: 'app-network-sketch',
  templateUrl: './network-sketch.component.html',
  styleUrls: ['./network-sketch.component.scss']
})
export class NetworkSketchComponent implements OnInit {
  @Input() data: Data;
  @Input() width: number = 600;
  @Input() height: number = 400;
  @Input() eventTrigger: boolean = true;
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  private dataStack: Data[] = [];
  private idx: number = 0;
  private selector: any;

  public contextMenuData: any = { node: null, link: null };
  public contextMenuPosition: any = { x: '0px', y: '0px' };
  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;

  constructor(
    private _appService: AppService,
    private _colorService: ColorService,
    private _dataService: DataService,
    private _networkService: NetworkService,
    private _networkSketchService: NetworkSketchService,
    private elementRef: ElementRef,
    private dialog: MatDialog,
  ) {
    this.selector = d3.select(elementRef.nativeElement);
  }

  ngOnInit() {
    // console.log('Init network sketch')
    this.history()
    d3.select('body').on('keyup', () => {
      if (d3.event.keyCode == '27') {
        this.selector.selectAll('.select').remove();
        this._networkService.resetSelection();
      }
      this._networkSketchService.keyDown = '';
    }).on('keydown', () => {
      this._networkSketchService.keyDown = d3.event.keyCode;
    })
  }

  selectedNode(): AppNode {
    return this._networkService.selected.node;
  }

  selectedLink(): AppLink {
    return this._networkService.selected.link;
  }

  history(): void {
    if (this.data == undefined) return
    // console.log('History')
    var data_cleaned = this._dataService.clean(this.data);
    this._networkService.validate(data_cleaned);
    if (this.idx < (this.dataStack.length - 1)) {
      this.dataStack = this.dataStack.slice(0, this.idx + 1);
    }
    this.dataStack.push(data_cleaned);
    this.idx = this.dataStack.length - 1;
  }

  undo(): void {
    this.idx = (this.idx == 0) ? 0 : this.idx - 1;
    this.data = this._dataService.clean(this.dataStack[this.idx]);
    this._networkService.validate(this.data);
    this.dataChange.emit(this.data)
  }

  redo(): void {
    this.idx = (this.idx == this.dataStack.length - 1) ? this.dataStack.length - 1 : this.idx + 1;
    this.data = this._dataService.clean(this.dataStack[this.idx]);
    this._networkService.validate(this.data);
    this.dataChange.emit(this.data)
  }

  clearDialog(): void {
    const dialogRef = this.dialog.open(NetworkClearDialogComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.data = this._dataService.newData();
        this.history()
        this.dataChange.emit(this.data)
      }
    });
  }

  colorNode(node: AppNode): string {
    return this._colorService.node(node);
  }

  colorLink(link: AppLink): string {
    var nodes = this.data.app.nodes;
    var connectome = this.data.simulation.connectomes[link.idx];
    return this._colorService.node(nodes[connectome.source]);
  }

  onDataChange(data: Data): void {
    // console.log('Network sketch change')
    this.history()
    this.dataChange.emit(this.data)
  }

  onSVGEnter(event: MouseEvent): void {
    if (!this.eventTrigger) return
    this._appService.rightClick = true;
  }

  onSVGLeave(event: MouseEvent): void {
    this._appService.rightClick = false;
    this._networkSketchService.reset();
  }

  onNodeEnter(event: MouseEvent, node: AppNode): void {
    this._networkSketchService.focused.link = null;
    this._networkSketchService.focused.node = node;
    var nodeSelected = this._networkService.selected.node;
    if (this.eventTrigger && nodeSelected) {
      var color = this._colorService.node(nodeSelected);
      this._networkSketchService.dragLine(nodeSelected.position, node.position, color, true)
    }
  }

  onLinkEnter(event: MouseEvent, link: AppLink): void {
    this._networkSketchService.focused.node = null;
    this._networkSketchService.focused.link = link;
  }

  onNodeClick(event: MouseEvent): void {
    this._networkSketchService.reset();
  }

  onLinkClick(event: MouseEvent): void {
    this._networkSketchService.reset();
  }

  onContextMenu(event: MouseEvent, node: AppNode, link: AppLink): void {
    if (!this.eventTrigger) return
    event.preventDefault();
    this._networkService.resetSelection();
    this._networkSketchService.reset();
    if (!this.eventTrigger) return
    this.contextMenuData.node = node;
    this.contextMenuData.link = link;
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

}
