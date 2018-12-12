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
    // console.log('Init SVG bar chart')
    this.subscription = this._chartService.update.subscribe(() => this.update())
  }

  ngOnDestroy() {
    // console.log('Destroy SVG bar chart')
    this.subscription.unsubscribe()
  }

  ngOnChanges() {
    // console.log('Change SVG bar chart')

    this.width = this.xScale.range()[1];
    this.xAxis = d3.axisBottom(this.xScale)
    this.yAxis = d3.axisLeft(this.yScale)

    this.update()
  }

  update() {
    // console.log('Update SVG bar chart')

    this.yAutoscale = this._chartService.yAutoscale || this.yAutoscale;
    if (this.yAutoscale) {
      this.yScale.domain(this.yDomain);
    }

    this.xAxis.scale(this.xScale).ticks(5);
    this.yAxis.scale(this.yScale).ticks(3);

  }

  transform(d) {
    return 'translate(' + this.x(d) + ',' + this.y(d) + ')'
  }

  x(d) {
    return (this.options.view == 'stack' || this._chartService.selected.length < 2) ? this.xScale(d.x0) : this.xScale(d.x0) + d.idx * this.binWidth(d)
  }

  y(d) {
    return this.options.view == 'stack' ? this.yScale(d.y1) : this.yScale(d.y)
  }

  binWidth(d) {
    let n = this.options.view == 'stack' ? 1. : this._chartService.selected.length || 1;
    return (this.xScale(d.x1) - this.xScale(d.x0)) / n
  }

  binHeight(d) {
    return this.yScale(this.options.view == 'stack' ? d.y0 : 0) - this.yScale(this.options.view == 'stack' ? d.y1 : d.y)
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
