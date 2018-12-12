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
  @Input() options: any;
  @Input() ordinate: any;
  @Input() xScale: any;
  @Input() yScale: any;
  private selector: d3.Selection;
  private subscription: any;
  public psth: any;
  public xDomain: any;
  public yDomain: any;

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
    if (xDomain[1] != xTicks[xTicks.length-1]) {
      xTicks.push(xDomain[1])
    }

    let histogram = d3.histogram()
      .domain(xDomain)
      .thresholds(xTicks);

    this.options['nbins'] = this.nbins;
    let colors = this._colorService.nodes;
    if (this.chart.includes('bar')) {
      this.options.view = this.chart.split(' ')[2];
      if (this._chartService.selected.length < 2) {
        let node_idx = this.options.node_idx;
        this.options.colors = node_idx.filter(d => this._chartService.selected.includes(d)).map(d => colors[d % colors.length][0]);
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
        hist.forEach(d => {
          d['y0'] = 0;
          d['y1'] = this.count_or_rate(d.length, d.x1 - d.x0);
          d['y'] = this.count_or_rate(d.length, d.x1 - d.x0);
          if (this.options.node_idx.length == 1 && this._chartService.selected.includes(this.options.node_idx[0])) {
            d['c'] = colors[this.options.node_idx[0] % colors.length][0];
          } else if (this._chartService.selected.length == 1 && this.options.node_idx.includes(this._chartService.selected[0])) {
            d['c'] = colors[this._chartService.selected[0] % colors.length][0];
          }
        })
        this.psth = hist;
        this.yDomain = [0, d3.max(hist, d => this.options.view == 'stack' ? d.y1 : d.y)]
      } else {
        let node_idx = this._chartService.selected;
        let data = node_idx.map(idx => this.data.filter(d => idx == this.options.global_ids[this.options.senders.indexOf(d.y)]).map(d => d.x));
        let hist = data.map(d => histogram(d));
        let dataset = xTicks.map(d => { return { x: d } });
        hist.forEach((d, i) => d.filter((dd, ii) => ii < dataset.length).map((dd, ii) => dataset[ii][node_idx[i]] = dd.length))
        let stack = d3.stack().keys(node_idx)(dataset);
        let psth = stack.map((d, i) => d.filter((dd, ii) => ii < xTicks.length-1).map((dd, ii) => {
          return {
            idx: i,
            x0: xTicks[ii],
            x1: xTicks[ii + 1],
            y0: this.count_or_rate(dd[0], xTicks[ii + 1] - xTicks[ii]),
            y1: this.count_or_rate(dd[1], xTicks[ii + 1] - xTicks[ii]),
            y: this.count_or_rate(dd[1] - dd[0], xTicks[ii + 1] - xTicks[ii]),
            c: colors[node_idx[i] % colors.length][0],
          }
        }))
        this.psth = d3.merge(psth);
        this.yDomain = [0, d3.max(d3.merge(psth), d => this.options.view == 'stack' ? d.y1 : d.y)]
      }
    } else {
      var node_idx = this.options.node_idx;
      // node_idx = this._chartService.selected.length == 0 ? node_idx : node_idx.filter(d => this._chartService.selected.includes(d))
      let data = node_idx.map(idx => this.data.filter(d => idx == this.options.global_ids[this.options.senders.indexOf(d.y)]).map(d => d.x));
      let hist = data.map(d => histogram(d))
      hist.forEach((d, i) => d.map(dd => {
        dd['x'] = (dd.x1 + dd.x0) / 2;
        dd['y'] = this.count_or_rate(dd.length, dd.x1 - dd.x0);
      }))
      hist.forEach((d, i) => {
        d['idx'] = node_idx[i];
        d['c'] = colors[node_idx[i] % colors.length][0];
      })
      let margin = this._chartService.g;
      this.options['lineHeight'] = this.yScale.range()[0];
      this.options['curve'] = d3.curveStep;
      this.psth = hist;
      this.yDomain = [0, d3.max(d3.merge(hist), d => d.y)]
    }
  }

  count_or_rate(d, dx) {
    if (d == 0 || dx == 0) { return 0 }
    return this.ordinate == 'count' ? d : d / dx / this.options.global_ids.length * 1000
  }

  yLabel() {
    return  this.ordinate == 'count' ? 'Spike count' : 'Firing rate [Hz]'
  }
}
