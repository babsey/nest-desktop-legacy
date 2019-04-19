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
  public top: number = 40;
  public g: any = {
    top: 15,
    right: 41,
    bottom: 30,
    left: 50,
  }
  public selected: any[] = [];
  public init = new EventEmitter();
  public update = new EventEmitter();
  public rescale = new EventEmitter();
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
    this.xScale = d3.scaleLinear().domain([0., this._dataService.data.kernel['time'] || 1000.])
    this.transition = d3.transition();
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

}
