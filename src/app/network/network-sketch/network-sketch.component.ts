import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';

import { DataService } from '../../services/data/data.service';
import { NetworkService } from '../services/network.service';
import { NetworkSketchService } from './network-sketch.service';

import { Data } from '../../classes/data';


@Component({
  selector: 'app-network-sketch',
  templateUrl: './network-sketch.component.html',
  styleUrls: ['./network-sketch.component.scss']
})
export class NetworkSketchComponent implements OnInit {
  @Input() data: Data;
  @Input() width: number = 600;
  @Input() height: number = 400;
  @Input() editable: boolean = false;
  @Output() sketchChange: EventEmitter<any> = new EventEmitter();
  private selector: any;
  public dataStack: Data[] = [];
  public idx: number = 0;

  constructor(
    private _dataService: DataService,
    private elementRef: ElementRef,
    public _networkService: NetworkService,
    public _networkSketchService: NetworkSketchService,
  ) {
    this.selector = d3.select(elementRef.nativeElement);
  }

  ngOnInit() {
    // console.log('Init network sketch')
    this.history()
  }

  history() {
    if (this.data == undefined) return
    // console.log('History')
    var data_cleaned = this._dataService.clean(this.data);
    if (this.idx < (this.dataStack.length - 1)) {
      this.dataStack = this.dataStack.slice(0, this.idx+1);
    }
    this.dataStack.push(data_cleaned);
    this.idx = this.dataStack.length - 1;
  }

  undo() {
    this.idx = (this.idx == 0) ? 0 : this.idx - 1;
    this.data = this._dataService.clean(this.dataStack[this.idx]);
    setTimeout(() => this._networkSketchService.update.emit(), 100)
    this.sketchChange.emit(this.data)
  }

  redo() {
    this.idx = (this.idx == this.dataStack.length - 1) ? this.dataStack.length - 1 : this.idx + 1;
    this.data = this._dataService.clean(this.dataStack[this.idx]);
    setTimeout(() => this._networkSketchService.update.emit(), 100)
    this.sketchChange.emit(this.data)
  }

  deleteSelected() {
    if (this._networkService.selected.node) {
      this._dataService.deleteNode(this.data, this._networkService.selected.node.idx)
    } else if (this._networkService.selected.link) {
      this._dataService.deleteLink(this.data, this._networkService.selected.link.idx)
    }
    this._networkService.resetMouseVars()
    this.changed()
  }

  clear() {
    // console.log('Network sketch sheet delete')
    this._networkSketchService.edit(true);
    this.data = this._dataService.emptyData();
    this.changed()
  }

  resetDragLine() {
    var dragline = this.selector.select('.dragline');
    dragline.attr('d', 'M0,0L0,0')
      .style('marker-start', '')
      .style('marker-end', '');
  }

  onChange(data) {
    // console.log('Network sketch change')
    this.history()
    this.sketchChange.emit(data)
  }

  changed() {
    this.history()
    // this._networkSketchService.update.emit()
    this.sketchChange.emit(this.data)
  }

}
