import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import * as d3 from 'd3';

import { ChartService } from '../chart.service';
import { ColorService } from '../../services/color/color.service';
import { ConfigService } from '../../config/config.service';
import { DataService } from '../../services/data/data.service';
import { MathService } from '../../services/math/math.service';
import { SketchService } from '../../sketch/sketch.service';

@Component({
  selector: 'app-trace-chart',
  templateUrl: './trace-chart.component.html',
  styleUrls: ['./trace-chart.component.css'],
})
export class TraceChartComponent implements OnInit, OnDestroy {
  @Input() idx: any;
  private record: any;
  private subscription: any
  public autofocus: any = false;
  public color: any;
  public data: any;
  public chart: any = 'line';
  public height: any;
  public neurons: any;
  public opacity: any = 1.;
  public opacityFocus: any = 1.;
  public options: any;
  public overlap: any = .5;
  public recorder: any;
  public sidenavOpened: any = false;
  public xDomain: any;
  public yDomain: any;
  public yScale: any;


  constructor(
    public _chartService: ChartService,
    public _colorService: ColorService,
    public _configService: ConfigService,
    public _dataService: DataService,
    private _mathService: MathService,
    public _sketchService: SketchService,
  ) {
  }

  ngOnInit() {
    // console.log('Init trace chart')
    this.subscription = this._chartService.init.subscribe(() => this.update())
    this.yScale = d3.scaleLinear();
    this.update()
  }

  ngOnDestroy() {
    // console.log('Destroy trace chart')
    this.subscription.unsubscribe()
  }

  update() {
    this.data = [];
    if (this._dataService.records.length == 0) return
    // console.log('Update trace chart')

    this.record = this._dataService.records[this.idx];
    this.recorder = this._dataService.data.collections[this.record.recorder.idx];
    this.neurons = this._dataService.data.connectomes
      .filter(d => d.post == this.recorder.idx)
      .map(d => this._dataService.data.collections[d.pre]);
    this.color = this._colorService.node(this.recorder);

    if (this._configService.config.app.chart.color) {
      this.selectAll()
    }

    if (!(['voltmeter', 'multimeter'].includes(this.recorder.model))) return
    var events = this.record.events;
    if (!('times' in events)) return

    var global_ids = {};
    this.neurons.forEach(d => d.global_ids.forEach(dd => { global_ids[dd] = d.idx }))

    var senders = events['senders'].filter(this._mathService.onlyUnique);
    var data = senders.map(() => { return [] })
    events['senders'].forEach((sender, idx) => {
      var senderIdx = senders.indexOf(sender);
      data[senderIdx].push({
        x: events['times'][idx],
        y: events['V_m'][idx]
      })
    });
    senders.forEach((d, i) => {
      var sender = senders[i];
      data[i].c = this._colorService.nodeIdx(global_ids[sender]);
    })
    this.data = data;

    this.options = {};
    this.options['senders'] = senders;
    this.options['global_ids'] = senders.map(d => global_ids[d]);
    this.xDomain = d3.extent(d3.merge(data.map(d => d3.extent(d, dd => dd.x))));
    this.yDomain = d3.extent(d3.merge(data.map(d => d3.extent(d, dd => dd.y))));

    this.height = this._chartService.height();
    this.scaleAxisY()
  }

  scaleAxisY() {
    var margin = this._chartService.g;
    let height = (this.height - margin.top - margin.bottom)
    let axisHeight = height / parseFloat(this.options['senders'].length);
    this.yScale.range([axisHeight + this.overlap * (height - axisHeight), 0]);
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

  onAutofocus(event) {
    this.autofocus = event.checked;
  }

  onChange(key, value) {
    this[key] = value || 0;
    this.scaleAxisY()
    this._chartService.update.emit()
  }
}
