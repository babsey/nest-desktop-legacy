import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import * as d3 from 'd3';

import { ChartService } from '../chart.service';
import { ColorService } from '../../services/color/color.service';
import { ConfigService } from '../../config/config.service';
import { DataService } from '../../services/data/data.service';
import { MathService } from '../../services/math/math.service';
import { SketchService } from '../../sketch/sketch.service';

@Component({
  selector: 'app-spike-chart',
  templateUrl: './spike-chart.component.html',
  styleUrls: ['./spike-chart.component.css'],
})
export class SpikeChartComponent implements OnInit, OnDestroy {
  @Input() idx: any;
  private record: any;
  private subscription: any;
  public color: any;
  public colors: any;
  public data: any;
  public nbins: any;
  public neurons: any;
  public ordinate: any = 'count';
  public psth: any;
  public recorder: any;
  public scatter: any;
  public sidenavOpened: any = false;
  public subchart: any = 'none';
  public xAxis: any;
  public xDomain: any;
  public yDomain: any;
  public opacity: any = 1;
  public overlap: any = 1;

  constructor(
    public _chartService: ChartService,
    private _colorService: ColorService,
    public _configService: ConfigService,
    private _dataService: DataService,
    private _mathService: MathService,
    public _sketchService: SketchService,
  ) {
    // console.log('Construct spike chart')
    this.nbins = this._configService.config.nest.node.nbins.value || 100;
  }

  ngOnInit() {
    // console.log('Init spike chart')
    this.subscription = this._chartService.init.subscribe(() => this.update())
    this.update()
  }

  ngOnDestroy() {
    // console.log('Destroy spike chart')
    this.subscription.unsubscribe()
  }

  update() {
    this.data = [];
    if (this._dataService.records.length == 0) return
    // console.log('Update spike chart')

    this.record = this._dataService.records[this.idx];
    this.recorder = this._dataService.data.collections[this.record.recorder.idx];
    this.neurons = this._dataService.data.connectomes
      .filter(d => d.post == this.recorder.idx)
      .map(d => this._dataService.data.collections[d.pre]);
    this.color = this._colorService.node(this.recorder);

    if (this._configService.config.app.chart.color) {
      this.selectAll()
    }

    if (this.recorder.model != 'spike_detector') return
    var events = this.record.events;
    if (!('times' in events)) return

    var global_ids = {};
    this.neurons.forEach(d => d.global_ids.forEach(dd => { global_ids[dd] = d.idx }))
    this.data = this._mathService.range(events.times.length).map(idx => {
      return {
        x: events.times[idx],
        y: events.senders[idx],
        c: this._colorService.nodeIdx(global_ids[events.senders[idx]]),
      }
    });

    var senders = events['senders'].filter(this._mathService.onlyUnique);
    senders.sort((a,b) => a-b)

    let scatterOptions = {};
    scatterOptions['recorder_idx'] = this.recorder.idx;
    scatterOptions['senders'] = senders;
    scatterOptions['global_ids'] = senders.map(d => global_ids[d]);
    scatterOptions['node_idx'] = this.neurons.map(d => d.idx);
    this.xDomain = [0, this._dataService.data.kernel.time || 1000.];
    let yDomain = d3.extent(d3.merge(this.neurons.map(d => d.global_ids)));
    this.yDomain = [yDomain[0] - 1, yDomain[1] + 1];

    this.scatter = {
      options: scatterOptions,
    };

    this.psth = {
      options: Object.assign({}, scatterOptions),
      yAutoscale: true,
      overlap: 0.5,
    };

    this.rescaleY()

  }

  rescaleY() {
    var margin = this._chartService.g;
    var height = this._chartService.height();
    this.scatter.height = height * (this.subchart=='none' ? 1. : .7);
    this.psth.height = height * (this.subchart=='none' ? 1. : .3);
    this.scatter.yScale = d3.scaleLinear().range([this.scatter.height - margin.top - margin.bottom, 0]);
    this.psth.yScale = d3.scaleLinear().range([this.psth.height - margin.top - margin.bottom, 0]);
    this._chartService.yAutoscale = true;
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

  onChange(value) {
    this.nbins = value;
  }
}
