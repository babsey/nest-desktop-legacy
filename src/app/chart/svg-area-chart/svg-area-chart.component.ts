import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import * as d3 from 'd3';

import { ChartService } from '../chart.service';

@Component({
  selector: 'app-svg-area-chart',
  templateUrl: './svg-area-chart.component.html',
  styleUrls: ['./svg-area-chart.component.css'],
})
export class SVGAreaChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: any;
  @Input() height: any;
  @Input() options: any;
  @Input() xDomain: any;
  @Input() xLabel: any;
  @Input() xScale: any;
  @Input() yDomain: any;
  @Input() yLabel: any;
  @Input() yScale: any;
  private subscription: any;
  public width: any;
  public xAxis: any;
  public yAutoscale: any = true;
  public yAxis: any;

  constructor(
    public _chartService: ChartService,
  ) {
  }

  ngOnInit() {
    // console.log('Init SVG area chart')
    this.subscription = this._chartService.update.subscribe(() => this.update())
  }

  ngOnDestroy() {
    // console.log('Destroy SVG area chart')
    this.subscription.unsubscribe()
  }

  ngOnChanges() {
    // console.log('Change SVG area chart')
    this.width = this.xScale.range()[1];

    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3.axisLeft(this.yScale)

    this.update()
  }

  update() {
    // console.log('Update SVG area chart')

    // var xDomain = this.xScale.domain();
    // let data = this.data.map(d => d.filter(dd => xDomain[0] <= dd.x && dd.x <= xDomain[1]));
    // let yDomain = d3.extent(d3.merge(data.map(d => d3.extent(d, dd => dd.y))));

    this.yAutoscale = this._chartService.yAutoscale || this.yAutoscale
    if (this.yAutoscale) {
      this.yScale.domain(this.yDomain)
    }

    this.xAxis.scale(this.xScale).ticks(5);
    this.yAxis.scale(this.yScale).ticks(3);
  }

  area(d) {
    return d3.area()
      .curve(this.options.curve ? this.options.curve : d3.curveLinear)
      .x(d => this.xScale(d.x))
      .y1(d => this.yScale(d.y))
      .y0(this.yScale(0))(d)
  }

  fill(d) {
    return this._chartService.selected.includes(d.idx) ? d.c : 'black'
  }

  opacity(d) {
    return (this._chartService.selected.includes(d.idx) ? 2. : .2) / this.options.node_idx.length
  }

  onAxesChange(events) {
    for (var key in events) {
      this[key] = events[key]
    }
    if ('xAutoscale' in events) {
      this._chartService.update.emit()
    } else {
      this.update()
    }
  }
}
