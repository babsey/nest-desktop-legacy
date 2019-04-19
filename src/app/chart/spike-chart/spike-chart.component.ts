import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';

import * as d3 from 'd3';

import { ChartConfigService } from '../../config/chart-config/chart-config.service';
import { ChartService } from '../chart.service';
import { ColorService } from '../../services/color/color.service';
import { DataService } from '../../services/data/data.service';
import { LogService } from '../../log/log.service';
import { MathService } from '../../services/math/math.service';
import { SketchService } from '../../sketch/sketch.service';

@Component({
  selector: 'app-spike-chart',
  templateUrl: './spike-chart.component.html',
  styleUrls: ['./spike-chart.component.css'],
})
export class SpikeChartComponent implements OnInit, OnDestroy {
  @Input() height: number = 0;
  @Input() idx: number;
  @Input() width: number = 0;
  private records: any;
  private subscriptionInit: any;
  private subscriptionRescale: any;
  public color: string;
  public data: any;
  public nbins: number;
  public neurons: any[];
  public opacity: number = 1;
  public ordinate: string = 'count';
  public overlap: number = 1;
  public psth: any;
  public recorder: any;
  public right: number = 0;
  public scatter: any;
  public subchart: string = 'none';
  public xDomain: number[];
  public xScale: d3.scaleLinear;
  public yDomain: number[];
  public yScale: d3.scaleLinear;

  public displayedColumns: string[] = ['sender', 'rate', 'mean_isi', 'std_isi'];
  public dataStats = new MatTableDataSource();

  constructor(
    public _chartConfigService: ChartConfigService,
    public _chartService: ChartService,
    private _colorService: ColorService,
    private _dataService: DataService,
    private _logService: LogService,
    private _mathService: MathService,
    public _sketchService: SketchService,
  ) {
    // console.log('Construct spike chart')
    this.nbins = 100;
    this.xScale = this._chartService.xScale;
  }

  ngOnInit() {
    this._logService.log('Init spike chart')
    this.subscriptionInit = this._chartService.init.subscribe(() => this.init())
    this.subscriptionRescale = this._chartService.rescale.subscribe(() => this.rescale())
    this.yScale = d3.scaleLinear()
    this.init()
  }

  ngOnDestroy() {
    this._logService.log('Destroy spike chart')
    this.subscriptionInit.unsubscribe()
    this.subscriptionRescale.unsubscribe()
  }

  init() {
    this.data = [];
    if (this._dataService.records.length == 0) return
    this._logService.log('Update spike chart')

    this.records = this._dataService.records[this.idx];
    this.recorder = this._dataService.data.collections[this.records.recorder.idx];
    this.neurons = this._dataService.data.connectomes
      .filter(d => d.post == this.recorder.idx)
      .map(d => this._dataService.data.collections[d.pre]);
    this.color = this._colorService.node(this.recorder);

    if (this._chartConfigService.config.autoColor) {
      this.selectAll()
    }

    if (this.records.recorder.model != 'spike_detector') return
    var events = this.records.events;
    if (!('times' in events)) return

    var node_idx = this.neurons.map(d => d.idx);
    var global_ids_all = this.neurons.map(d => d.global_ids);
    var neuron2node = {};
    this.neurons.forEach(neuron => neuron.global_ids.forEach(id => { neuron2node[id] = neuron.idx }));
    var count = this.neurons.map(d => 0);
    this.data = this._mathService.range(events.times.length).map(idx => {
      count[node_idx.indexOf(neuron2node[events.senders[idx]])]++
      return {
        x: events.times[idx],
        y: events.senders[idx],
        c: this._colorService.nodeIdx(neuron2node[events.senders[idx]]),
      }
    });

    var senders = events['senders'].filter(this._mathService.onlyUnique);
    senders.sort((a, b) => a - b)

    var dataGrouped = senders.map(d => [])
    this.data.map(d => {
      var idx = senders.indexOf(d.y);
      dataGrouped[idx].push(d.x);
    })

    var ISI = dataGrouped.map((d, i) => {
      d.sort((a, b) => a - b)
      var isi = [];
      for (var ii = 0; ii < d.length - 1; ii++) {
        isi.push(d[ii + 1] - d[ii])
      }
      return isi
    })

    var ISIPooled = this.neurons.map(neuron =>
      d3.merge(
        neuron.global_ids.map(global_id => {
          return senders.includes(global_id) ? ISI[senders.indexOf(global_id)] : [];
        })
      )
    )

    this.dataStats.data = ISIPooled.map((isi, i) => {
      var mean_isi = d3.mean(isi);
      var std_isi = d3.deviation(isi);

      return {
        sender: this.neurons[i].global_ids,
        color: this._colorService.nodeIdx(this.neurons[i].idx),
        rate: count[i] / this.neurons[i].global_ids.length || 0,
        mean_isi: mean_isi || 0,
        std_isi: std_isi || 0,
        cv_isi: std_isi / mean_isi || 0,
      }
    })

    let scatterOptions = {};
    scatterOptions['recorder_idx'] = this.recorder.idx;
    scatterOptions['senders'] = senders;
    scatterOptions['neuron2node'] = neuron2node;
    scatterOptions['node_idx'] = this.neurons.map(d => d.idx);

    this.xDomain = [0, this._dataService.data.kernel.time || 1000.];
    this.xScale.domain(this.xDomain);
    let yDomain = d3.extent(d3.merge(global_ids_all));
    this.yDomain = [yDomain[1] + .5, yDomain[0] - .5]
    this.yScale.domain(this.yDomain);

    this.scatter = {
      options: scatterOptions,
    };

    this.psth = {
      options: Object.assign({}, scatterOptions),
      yAutoscale: true,
      overlap: 0.5,
    };

    this.rescale()
  }

  rescale() {
    this.rescaleX()
    this.rescaleY()
  }

  rescaleX() {
    let margin = this._chartService.g;
    let width = this.width - margin.left - margin.right;
    // this.right = this._chartService.sidenavOpened ? 320 : 0;
    this.xScale.range([0, width - this.right]);
  }

  rescaleY() {
    var margin = this._chartService.g;
    var height = this.height - this._chartService.top;
    this.scatter.height = height * (this.subchart == 'none' ? 1. : .7);
    this.psth.height = height * (this.subchart == 'none' ? 1. : .3);
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

  onSelectionChange(event) {
    this._chartConfigService.config[event.option.value] = event.option.selected;
    this._chartConfigService.save()

    if (event.option.value == 'autoColor') {
      event.option.selected ? this.selectAll() : this.selectNone()
    }
  }

}
