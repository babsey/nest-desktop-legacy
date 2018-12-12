// https://bl.ocks.org/mbostock/3883245
import { Component, Input, OnInit, OnChanges, OnDestroy, ElementRef } from '@angular/core';
import * as d3 from 'd3';

import { ChartService } from '../chart.service';

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.css'],
})
export class AreaChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() autofocus: any;
  @Input() data: any;
  @Input() height: any;
  @Input() opacity: any = .25;
  @Input() opacityFocus: any = .75;
  @Input() options: any;
  @Input() xDomain: any;
  @Input() xLabel: any;
  @Input() xScale: any;
  @Input() yDomain: any;
  @Input() yLabel: any;
  @Input() yScale: any;
  private area: any;
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
    // console.log('Init area chart')
    this.subscription = this._chartService.update.subscribe(() => this.update())
  }

  ngOnDestroy() {
    // console.log('Destroy area chart')
    this.subscription.unsubscribe()
  }

  ngOnChanges() {
    // console.log('Changes area chart')
    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3.axisLeft(this.yScale);
    this.update()
  }

  update() {
    // console.log('Update area chart')
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

    var canvas = this.selector.select('.areas')
      .attr('width', width)
      .attr('height', height)
      .attr('transform', 'translate(10,10)');
    var context = canvas.node().getContext('2d');

    var area = d3.area()
      .curve(this.options.curve ? this.options.curve : d3.curveLinear)
      .x(d => this.xScale(d.x))
      .y0(axisHeight)
      .y1(d => this.yScale(d.y))
      .context(context);

    this.n = data.length

    context.clearRect(0, 0, width, height);
    data.forEach((d, i) => {
      context.beginPath();
      if (data.length > 1) {
        context.globalAlpha = this._opacity(i);
      }
      area(d);
      context.lineWidth = 1;
      context.strokeStyle = this.color(this.data[i], i);
      context.stroke();
      context.fillStyle = this.color(this.data[i], i);
      context.fill();
      let lineHeight = (height - axisHeight) / (this.n - 1);
      context.transform(1,0,0,1,0, height == lineHeight ? 0 : lineHeight)
    })

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

  _opacity(idx) {
    let margin = this._chartService.g;
    let height = this.height - margin.top - margin.bottom;
    let axisHeight = this.yScale.range()[0];
    if (axisHeight == height || (this.idx != idx || !this.autofocus)) {
      return this.opacity;
    } else {
      return this.opacityFocus;
    }
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
