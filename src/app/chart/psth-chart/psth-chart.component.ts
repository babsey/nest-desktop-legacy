import { Component, OnInit, OnDestroy, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

import { ChartService } from '../chart.service';
import { ColorService } from '../../services/color/color.service';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-psth-chart',
  templateUrl: './psth-chart.component.html',
  styleUrls: ['./psth-chart.component.css']
})
export class PsthChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() chart: any;
  @Input() data: any;
  @Input() height: any;
  @Input() nbins: any;
  @Input() opacity: any;
  @Input() options: any;
  @Input() ordinate: any;
  @Input() overlap: any;
  @Input() xScale: any;
  @Input() yScale: any;
  private selector: d3.Selection;
  private subscription: any;
  public psth: any;
  public xDomain: any;
  public yDomain: any;
  private popsize: any;

  constructor(
    private _chartService: ChartService,
    private _colorService: ColorService,
    private _dataService: DataService,
    private elementRef: ElementRef,
  ) {
    this.selector = d3.select(elementRef.nativeElement);
  }

  ngOnInit() {
    // console.log('Init PSTH chart')
    this.xDomain = this._chartService.xScale.domain();
    this.subscription = this._chartService.update.subscribe(d => this.update())
  }

  ngOnDestroy() {
    // console.log('Destroy PSTH chart')
    this.subscription.unsubscribe()
  }

  ngOnChanges() {
    // console.log('Change PSTH chart')
    this.update()
  }

  update() {
    if (this.data == undefined || this.data.length == 0) return
    // console.log('Upate PSTH chart')
    let xDomain = this._chartService.xScale.domain();
    var xTicks = this.nbins == 1 ? xDomain : this._chartService.xScale.ticks(this.nbins);
    if (xDomain[0] != xTicks[0]) {
      xTicks.unshift(xDomain[0])
    }
    if (xDomain[1] != xTicks[xTicks.length - 1]) {
      xTicks.push(xDomain[1])
    }

    if (!this.chart.includes('bar')) {
      var margin = this._chartService.g;
      let height = (this.height - margin.top - margin.bottom)
      let axisHeight = height / parseFloat(this.options.node_idx.length);
      this.yScale.range([axisHeight + this.overlap * (height - axisHeight), 0]);
    }

    let histogram = d3.histogram()
      .domain(xDomain)
      .thresholds(xTicks);

    this.popsize = this.count(this.options.global_ids);
    this.options['nbins'] = this.nbins;

    if (this.chart.includes('bar')) { // bar chart
      this.options.view = this.chart.split(' ')[2];
      if (this._chartService.selected.length < 2) { // one population
        let node_idx = this.options.node_idx;
        this.options.colors = node_idx.filter(d => this._chartService.selected.includes(d)).map(d => this._colorService.nodeIdx(d));
        var senders = d3.merge(
          this._chartService.selected
            .filter(d => node_idx.includes(d))
            .map(d => this._dataService.data.collections[d].global_ids)
        );
        if (senders.length == 0) {
          senders = this.options.senders;
        }
        let data = this.data.filter(d => senders.includes(d.y)).map(d => d.x);
        let hist = histogram(data);
        hist.forEach((d, i) => {
          d['y0'] = 0;
          d['y1'] = this.count_or_rate(i, d.length, d.x1 - d.x0);
          d['y'] = this.count_or_rate(i, d.length, d.x1 - d.x0);
          if (this.options.node_idx.length == 1 && this._chartService.selected.includes(this.options.node_idx[0])) {
            d['c'] = this._colorService.nodeIdx(this.options.node_idx[0]);
          } else if (this._chartService.selected.length == 1 && this.options.node_idx.includes(this._chartService.selected[0])) {
            d['c'] = this._colorService.nodeIdx(this._chartService.selected[0]);
          }
        })
        this.psth = hist;
        this.yDomain = [0, d3.max(hist, d => this.options.view == 'stack' ? d.y1 : d.y)]
      } else { // more than one population
        let node_idx = this._chartService.selected;
        let data = node_idx.map(idx => this.data.filter(d => idx == this.options.global_ids[this.options.senders.indexOf(d.y)]).map(d => d.x));
        let hist = data.map(d => histogram(d));
        let dataset = xTicks.map(d => { return { x: d } });
        hist.forEach((d, i) => d.filter((dd, ii) => ii < dataset.length).map((dd, ii) => dataset[ii][node_idx[i]] = dd.length))
        let stack = d3.stack().keys(node_idx)(dataset);
        let psth = stack.map((d, i) => d.filter((dd, ii) => ii < xTicks.length - 1).map((dd, ii) => {
          var y = this.count_or_rate(i, dd[1] - dd[0], xTicks[ii + 1] - xTicks[ii])
          return {
            idx: i,
            x0: xTicks[ii],
            x1: xTicks[ii + 1],
            y0: 0,
            y1: y,
            y: y,
            c: this._colorService.nodeIdx(node_idx[i]),
          }
        }))
        psth.map((d, i) => d.map((dd, ii) => {
            var y0 = i == 0 ? 0 : psth[i - 1][ii]['y1'];
            dd['y0'] = y0;
            dd['y1'] = y0 + dd['y'];
          })
        )
        this.psth = d3.merge(psth);
        this.yDomain = [0, d3.max(d3.merge(psth), d => this.options.view == 'stack' ? d.y1 : d.y)]
      }
    } else { // line chart
      var node_idx = this.options.node_idx;
      // node_idx = this._chartService.selected.length == 0 ? node_idx : node_idx.filter(d => this._chartService.selected.includes(d))
      let data = node_idx.map(idx => this.data.filter(d => idx == this.options.global_ids[this.options.senders.indexOf(d.y)]).map(d => d.x));
      let hist = data.map(d => histogram(d))
      hist.forEach((d, i) => d.map(dd => {
        dd['x'] = (dd.x1 + dd.x0) / 2;
        dd['y'] = this.count_or_rate(hist.length - i - 1, dd.length, dd.x1 - dd.x0);
      }))
      hist.forEach((d, i) => {
        d['idx'] = node_idx[i];
        d['c'] = this._colorService.nodeIdx(node_idx[i]);
      })
      let margin = this._chartService.g;
      this.options['lineHeight'] = this.yScale.range()[0];
      this.options['curve'] = d3.curveStep;
      this.psth = hist;
      this.yDomain = [0, d3.max(d3.merge(hist), d => d.y)]
    }
  }

  count(arr) {
    var a = [], b = [], prev;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] !== prev) {
        a.push(arr[i]);
        b.push(1);
      } else {
        b[b.length - 1]++;
      }
      prev = arr[i];
    }
    return [a, b];
  }

  count_or_rate(i, d, dx) {
    if (d == 0 || dx == 0) { return 0 }
    return this.ordinate == 'count' ? d : d / dx / this.popsize[1][i] * 1000;
  }

  yLabel() {
    return this.ordinate == 'count' ? 'Spike count' : 'Firing rate [Hz]';
  }
}
