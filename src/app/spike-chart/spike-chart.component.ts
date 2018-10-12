import { Component, OnInit, Input } from '@angular/core';

import { DataService } from '../shared/services/data/data.service';
import { ChartService } from '../shared/services/chart/chart.service';
import { MathService } from '../shared/services/math/math.service';


@Component({
  selector: 'g[app-spike-chart]',
  templateUrl: './spike-chart.component.html',
  styleUrls: ['./spike-chart.component.css'],
})
export class SpikeChartComponent implements OnInit {
  @Input() idx: any;
  public data: any = [];
  private services: any;
  public options: any;

  constructor(
    private _chartService: ChartService,
    private _dataService: DataService,
    private _mathService: MathService,
  ) {
    this.services = {
      chart: _chartService,
      data: _dataService,
      math: _mathService,
    };
    this.options = this._chartService.options;
  }

  update() {
    this.data = [];
    // if (this.services.data.records.length == 0) return
    var record = this._dataService.records[this.idx];
    var node = this._dataService.data.collections[record.node];
    if (node.model != 'spike_detector') return
    var events = record.events;
    if (!('times' in events)) return
    this.data = this.services.math.range(events.times.length).map((idx) => {
      return { x: events.times[idx], y: events.senders[idx] }
    });
  }

  ngOnInit() {
    this.update()
  }

}
