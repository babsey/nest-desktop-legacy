import {
  Injectable,
  EventEmitter
} from '@angular/core';

import * as d3 from 'd3';

import { DataService } from '../services/data/data.service';
import { ChartConfigService } from '../config/chart-config/chart-config.service';

var STORAGE_NAME = 'chart-config';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  public svg: any = {
    width: 640,
    height: 480,
    left: 36,
    top: 58,
  }
  public g: any = {
    top: 15,
    right: 22,
    bottom: 30,
    left: 50,
  }
  public selected: any[] = [];
  public init = new EventEmitter();
  public update = new EventEmitter();
  public xScale: d3.scaleLinear;
  public transition: d3.transition;
  public drag: boolean = false;
  public xAutoscale: boolean = true;
  public yAutoscale: boolean = true;
  public show: boolean = true;
  public sidenavOpened: boolean = false;
  public selectedIndex: number = 0;

  constructor(
    private _dataService: DataService,
    public _chartConfigService: ChartConfigService,
  ) {
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
