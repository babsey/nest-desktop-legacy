import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';

import * as d3 from 'd3';

import { ChartConfigService } from '../../config/chart-config/chart-config.service';
import { ChartService } from '../chart.service';
import { ColorService } from '../../services/color/color.service';
import { DataService } from '../../services/data/data.service';
import { LogService } from '../../log/log.service';
import { MathService } from '../../services/math/math.service';
import { ControllerConfigService } from '../../config/controller-config/controller-config.service';
import { SketchService } from '../../sketch/sketch.service';

export interface StatElement {
  neuron: string;
  max: number;
  min: number;
  mean: number;
  std: number;
}

@Component({
  selector: 'app-trace-chart',
  templateUrl: './trace-chart.component.html',
  styleUrls: ['./trace-chart.component.css'],
})
export class TraceChartComponent implements OnInit, OnDestroy {
  @Input() idx: number;
  private record: any;
  private subscription$: any;
  public chart: string = 'line';
  public color: string;
  public data: any;
  public height: number;
  public neurons: any[];
  public opacity: number = 1;
  public overlap: number = 1;
  public record_from: string = 'V_m';
  public recorder: any;
  public sender: any;
  public senders: any;
  public xDomain: number[];
  public xLabel: string = '';
  public yDomain: number[];
  public yLabel: string = '';
  public yScale: d3.scaleLinear;
  public senderConfig = {
    "id": "sender",
    "label": "Neuron",
    "value": 0,
    "view": "tickSlider",
    "inputSpec": {
      "ticks": []
    }
  };

  // @ViewChild(MatSort) sort: MatSort;
  public displayedColumns: string[] = ['sender', 'min', 'max', 'mean', 'std'];
  public dataStats = new MatTableDataSource();

  constructor(
    public _chartConfigService: ChartConfigService,
    public _chartService: ChartService,
    public _colorService: ColorService,
    public _dataService: DataService,
    private _logService: LogService,
    private _mathService: MathService,
    public _controllerConfigService: ControllerConfigService,
    public _sketchService: SketchService,
  ) {
  }

  ngOnInit() {
    this._logService.log('Init trace chart')
    this.subscription$ = this._chartService.init.subscribe(() => this.update())
    this.yScale = d3.scaleLinear();
    this.update()
  }

  ngOnDestroy() {
    this._logService.log('Destroy trace chart')
    this.subscription$.unsubscribe()
  }

  update() {
    this.data = [];
    if (this._dataService.records.length == 0) return
    this._logService.log('Update trace chart')

    this.record = this._dataService.records[this.idx];
    this.recorder = this._dataService.data.collections[this.record.recorder.idx];
    if (!(['voltmeter', 'multimeter'].includes(this.recorder.model))) return
    if ('record_from' in this.recorder && !this.recorder.record_from.includes('V_m')) {
      this.record_from = this.recorder.record_from[0];
    }

    this.neurons = this._dataService.data.connectomes
      .filter(d => d.post == this.recorder.idx)
      .map(d => this._dataService.data.collections[d.pre]);
    this.color = this._colorService.node(this.recorder);

    if (this._chartConfigService.config.autoColor) {
      this.selectAll()
    }

    var events = this.record.events;
    if (!('times' in events)) return

    var neuron2node = {};
    this.neurons.forEach(d => d.global_ids.forEach(dd => { neuron2node[dd] = d.idx }))

    this.senders = events['senders'].filter(this._mathService.onlyUnique);
    this.sender = this.senders[0];
    this.senderConfig.value = this.senders[0];
    this.senderConfig.inputSpec.ticks = this.senders;

    var data = this.senders.map(() => { return [] });
    var dataStats = [];
    events['senders'].forEach((sender, idx) => {
      var senderIdx = this.senders.indexOf(sender);
      data[senderIdx].push({
        x: events['times'][idx],
        y: events[this.record_from][idx]
      })
    });
    this.senders.forEach((d, i) => {
      data[i]._meta = {
        sender: d,
        nodeIdx: neuron2node[d],
        color: this._colorService.nodeIdx(neuron2node[d]),
      };
      dataStats.push({
        idx: i,
        sender: d,
        node: neuron2node[d],
        color: this._colorService.nodeIdx(neuron2node[d]),
        min: d3.min(data[i], d => d.y),
        max: d3.max(data[i], d => d.y),
        mean: d3.mean(data[i], d => d.y),
        std: d3.deviation(data[i], d => d.y),
      })
    })
    this.data = data;
    this.dataStats.data = dataStats;

    this.xDomain = d3.extent(events['times']);
    this.yDomain = d3.extent(events[this.record_from]);

    this.xLabel = 'Time [ms]';
    let yAxis = this._controllerConfigService.config.label[this.record_from];
    this.yLabel = yAxis.label + (yAxis.unit ? ' [' + yAxis.unit + ']' : '');

    this.height = this._chartService.height();
  }

  selectAll() {
    this.neurons.forEach(neuron => {
      if (!this._chartService.selected.includes(neuron.idx)) {
        this._chartService.select(neuron)
      }
    })
  }

  selectNone() {
    this.neurons.forEach(neuron => {
      if (this._chartService.selected.includes(neuron.idx)) {
        this._chartService.select(neuron)
      }
    })
  }

  onSelectionChange(event) {
    this._chartConfigService.config[event.option.value] = event.option.selected;
    this._chartConfigService.save()

    if (event.option.value == 'autoColor') {
      event.option.selected ? this.selectAll() : this.selectNone()
    }
  }

}
