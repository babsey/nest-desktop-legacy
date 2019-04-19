import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';

import * as d3 from 'd3';

import { ChartService } from '../chart.service';

@Component({
  selector: 'app-svg-bar-chart',
  templateUrl: './svg-bar-chart.component.html',
  styleUrls: ['./svg-bar-chart.component.css']
})
export class SVGBarChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: any;
  @Input() height: number = 0;
  @Input() margin: any = { top: 0, right: 0, bottom: 0, left: 0 };
  @Input() opacity: number = 1;
  @Input() options: any;
  @Input() view: string;
  @Input() width: number = 0;
  @Input() xDomain: number[];
  @Input() xLabel: string = '';
  @Input() xScale: d3.scaleLinear;
  @Input() yDomain: number[];
  @Input() yLabel: string = '';
  @Input() yScale: d3.scaleLinear;
  private subscription: any;
  public xAxis: d3.axisBottom;
  public yAutoscale: boolean = true;
  public yAxis: d3.axisLeft;

  constructor(
    public _chartService: ChartService,
  ) {
    this.xScale = this.xScale || this._chartService.xScale;
  }

  ngOnInit() {
    // console.log('Init SVG bar chart')
    this.subscription = this._chartService.update.subscribe(() => this.update())
  }

  ngOnDestroy() {
    // console.log('Destroy SVG bar chart')
    this.subscription.unsubscribe()
  }

  ngOnChanges() {
    // console.log('Change SVG bar chart')
    this.update()
  }

  update() {
    // console.log('Update SVG bar chart')
    this.xAxis = d3.axisBottom(this.xScale)
    this.yAxis = d3.axisLeft(this.yScale)

    this.yAutoscale = this._chartService.yAutoscale || this.yAutoscale;
    if (this.yAutoscale) {
      this.yScale.domain(this.yDomain);
    }

    this.xAxis.scale(this.xScale).ticks(5);
    this.yAxis.scale(this.yScale).ticks(3).tickSize(-this.xScale.range()[1]);

  }

  transform(d) {
    return 'translate(' + this.x(d) + ',' + this.y(d) + ')'
  }

  x(d) {
    return (this.view == 'stack' || this._chartService.selected.length < 2) ? this.xScale(d.x0) : this.xScale(d.x0) + d.idx * this.binWidth(d)
  }

  y(d) {
    return this.view == 'stack' ? this.yScale(d.y1) : this.yScale(d.y)
  }

  binWidth(d) {
    let n = this.view == 'stack' ? 1. : this._chartService.selected.length || 1;
    return (this.xScale(d.x1) - this.xScale(d.x0)) / n
  }

  binHeight(d) {
    return this.yScale(this.view == 'stack' ? d.y0 : 0) - this.yScale(this.view == 'stack' ? d.y1 : d.y)
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
