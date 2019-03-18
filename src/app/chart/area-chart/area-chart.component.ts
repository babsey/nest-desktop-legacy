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
  @Input() curve: d3.curveLinear = d3.curveLinear;
  @Input() data: any;
  @Input() height: number;
  @Input() idx: number = 0;
  @Input() opacity: number = 1;
  @Input() options: any = {};
  @Input() overlap: number = 0;
  @Input() xDomain: number[];
  @Input() xLabel: string = '';
  @Input() xScale: d3.scaleLinear;
  @Input() yDomain: number[];
  @Input() yLabel: string = '';
  @Input() yScale: d3.scaleLinear;
  private area: d3.area;
  private selector: d3.selection;
  private subscription$: any;
  public n: number = 1;
  public xAxis: d3.axisBottom;
  public yAutoscale: boolean = true;
  public yAxis: d3.axisLeft;

  constructor(
    public _chartService: ChartService,
    private elementRef: ElementRef,
  ) {
    this.selector = d3.select(this.elementRef.nativeElement);
  }

  ngOnInit() {
    // console.log('Init area chart')
    this.subscription$ = this._chartService.update.subscribe(() => this.update())
  }

  ngOnDestroy() {
    // console.log('Destroy area chart')
    this.subscription$.unsubscribe()
  }

  ngOnChanges() {
    // console.log('Changes area chart')
    let margin = this._chartService.g;
    let height = (this.height - margin.top - margin.bottom);
    this.xAxis = d3.axisBottom(this.xScale)
      .tickSize(-height);
    this.yAxis = d3.axisLeft(this.yScale)
      .tickSize(-this.xScale.range()[1]);
    this.update()
  }

  update() {
    // console.log('Update area chart')
    this.xScale = this.xScale || this._chartService.xScale;
    let xDomain = this.xScale.domain();

    let selected = this._chartService.selected;
    var data = this.data; //.filter((d,i) => selected.length < 1 ? true : selected.includes(d._meta.nodeIdx));
    var _meta = data.map(d => d._meta);
    data = data.map(d => d.filter(dd => xDomain[0] <= dd.x && dd.x <= xDomain[1]));
    if (data.length == 0) return
    this.n = data.length;

    let width = this.xScale.range()[1];
    let margin = this._chartService.g;
    let height = (this.height - margin.top - margin.bottom)
    let dataHeight = height / (this.n || 1);
    let axisHeight = dataHeight + this.overlap * (height - dataHeight);
    this.yScale.range([axisHeight, 0]);

    this.yAutoscale = this._chartService.yAutoscale || this.yAutoscale;
    if (this.yAutoscale) {
      let yDomain = d3.extent(d3.merge(data), d => d.y);
      this.yScale.domain(yDomain)
    }

    this.xAxis.scale(this.xScale).ticks(5);
    this.yAxis.scale(this.yScale).ticks(3);

    var canvas = this.selector.select('.areas')
      .attr('width', width)
      .attr('height', height)
      .attr('transform', 'translate(10,10)');
    var context = canvas.node().getContext('2d');

    var area = d3.area()
      .curve(this.curve)
      .x(d => this.xScale(d.x))
      .y0(axisHeight)
      .y1(d => this.yScale(d.y))
      .context(context);

    context.clearRect(0, 0, width, height);
    data.reverse()
    data.forEach((d, i) => {
      var idx = data.length - i - 1;
      var color = selected.length != 0 && selected.includes(_meta[idx].nodeIdx) ? _meta[idx].color : 'black';
      context.beginPath();
      context.globalAlpha = (this.idx == idx) ? 1 : this.opacity;
      area(d);
      context.lineWidth = 1;
      context.strokeStyle = color;
      context.stroke();
      context.fillStyle = color;
      context.fill();
      let lineHeight = (this.n <= 1) ? 0 : (height - axisHeight) / (this.n - 1);
      context.transform(1,0,0,1,0, lineHeight)
    })

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
