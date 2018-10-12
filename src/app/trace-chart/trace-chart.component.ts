import { Component, OnInit, Input } from '@angular/core';

import * as d3 from 'd3';

import { DataService } from '../shared/services/data/data.service';
import { ChartService } from '../shared/services/chart/chart.service';
import { MathService } from '../shared/services/math/math.service';

@Component({
  selector: 'g[app-trace-chart]',
  templateUrl: './trace-chart.component.html',
  styleUrls: ['./trace-chart.component.css'],
})
export class TraceChartComponent implements OnInit {
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
    this.options = this.services.chart.options;
  }

  update() {
    this.data = [];
    if (this.services.data.records.length == 0) return
    var record = this._dataService.records[this.idx];
    var node = this._dataService.data.collections[record.node];

    if (node.model != 'voltmeter') return
    var events = record.events;
    if (!('times' in events)) return

    var senders = events['senders'].filter(this.services.math.onlyUnique);
    var data = senders.map(() => { return []})
    events['senders'].map((sender, idx) => {
        var senderIdx = senders.indexOf(sender);
        data[senderIdx].push({ x: events['times'][idx], y: events['V_m'][idx] })
    });
    this.options.xDomain = d3.extent(events['times']);
    this.options.yDomain = d3.extent(events['V_m']);
    this.data = data;
  }

  ngOnInit() {
    this.update()
  }

}
