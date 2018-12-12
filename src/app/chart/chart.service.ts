import {
  Injectable,
  EventEmitter
} from '@angular/core';

import * as d3 from 'd3';

import { DataService } from '../services/data/data.service';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  public svg = {
    width: 640,
    height: 480,
    left: 36,
    top: 74,
  }
  public g = {
    top: 10,
    right: 20,
    bottom: 30,
    left: 50,
  }
  public selected: any = [];
  public init: EventEmitter<any>;
  public update: EventEmitter<any>;
  public xScale: any;
  public transition: any;
  public drag: any = false;
  public xAutoscale: any = true;
  public yAutoscale: any = true;
  public show: any = true;

  constructor(
    private _dataService: DataService,
  ) {
    this.init = new EventEmitter();
    this.update = new EventEmitter();
    this.xScale = d3.scaleLinear().range([0, this.svg.width - this.g.left - this.g.right]).domain([0., this._dataService.data.kernel['time'] || 1000.])
    this.transition = d3.transition();
  }

  height() {
    return (this.svg.height / (this._dataService.records.length || 1)) - this.svg.top
  }

  isSelected(neuron) {
    return this.selected.includes(neuron.idx)
  }

  select(neuron) {
    if (this.selected.includes(neuron.idx)) {
      this.selected = this.selected.filter((d) => d != neuron.idx)
    } else {
      this.selected.push(neuron.idx)
    }
    this.selected.sort()
    this.update.emit()
  }

  pointerEvents() {
    return this.drag ? 'none' : 'all';
  }

  resize(width, height) {
    // console.log('resize')
    this.svg.height = height;
    this.svg.width = width - this.svg.left;
    this.xScale.range([0, this.svg.width - this.g.left - this.g.right]);
    this.init.emit()
  }
}
