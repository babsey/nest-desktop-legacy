// https://bl.ocks.org/mbostock/3883245
import { Component, Input, OnInit, OnChanges, OnDestroy, ElementRef } from '@angular/core';
import * as d3 from 'd3';

import { ChartService } from '../chart.service';

@Component({
  selector: 'app-svg-line-chart',
  templateUrl: './svg-line-chart.component.html',
  styleUrls: ['./svg-line-chart.component.css'],
})
export class SVGLineChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() axisShift: any;
  @Input() data: any;
  @Input() height: any;
  @Input() options: any;
  @Input() xDomain: any;
  @Input() xLabel: any;
  @Input() xScale: any;
  @Input() yDomain: any;
  @Input() yLabel: any;
  @Input() yScale: any;
  private selector: any;
  private subscription: any;
  public n: any;
  public xAxis: any;
  public yAutoscale: any = true;
  public yAxis: any;
  private idx: any = 0;

  constructor(
    public _chartService: ChartService,
    private elementRef: ElementRef,
  ) {
    this.selector = d3.select(this.elementRef.nativeElement);

  }

  ngOnInit() {
    // console.log('Init SVG line chart')
    this.subscription = this._chartService.update.subscribe(() => this.update())
  }

  ngOnDestroy() {
    // console.log('Destroy SVG line chart')
    this.subscription.unsubscribe()
  }

  ngOnChanges() {
    // console.log('Changes SVG line chart')
    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3.axisLeft(this.yScale);
    this.update()
  }

  update() {
    // console.log('Update SVG line chart')
    this.xScale = this.xScale || this._chartService.xScale;
    let xDomain = this.xScale.domain();
    let data = this.data.map(d => d.filter(dd => xDomain[0] <= dd.x && dd.x <= xDomain[1]));
    if (data.length == 0) return

    this.yAutoscale = this._chartService.yAutoscale || this.yAutoscale;
    if (this.yAutoscale) {
      let yDomain = d3.extent(d3.merge(data), d => d.y);
      this.yScale.domain(yDomain)
    }
    // } else if (this._chartService.yAutoscale) {
    //   this.yScale.domain(this.yDomain)
    // }

    this.xAxis.scale(this.xScale).ticks(5);
    this.yAxis.scale(this.yScale).ticks(3);

    let width = this.xScale.range()[1];
    let margin = this._chartService.g;
    let height = this.height - margin.top - margin.bottom;
    let axisHeight = this.yScale.range()[0];

    this.n = data.length
  }

  color(d, i) {
    if ('node_idx' in this.options) {
      if (this._chartService.selected.includes(d.idx)) {
        return d.c
      }
    } else if (this._chartService.selected.includes(this.options.global_ids[i])) {
      return d.c
    }
    return 'black'
  }

  transform(d, i) {
    let margin = this._chartService.g;
    let height = this.height - margin.top - margin.bottom;
    let lineHeight = this.options.lineHeight;
    return 'translate(0,' + (lineHeight == height ? '0' : (height - (i + 1) * lineHeight)) + ')'
  }

  line(d) {
    return d3.line()
      .curve(this.options.curve ? this.options.curve : d3.curveLinear)
      .x(d => this.xScale(d.x))
      .y(d => this.yScale(d.y))(d)
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
