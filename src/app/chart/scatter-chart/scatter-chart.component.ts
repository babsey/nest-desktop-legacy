import { Component, Input, OnInit, OnChanges, ElementRef, OnDestroy } from '@angular/core';

import * as d3 from 'd3';

import { ChartService } from '../chart.service';

@Component({
  selector: 'app-scatter-chart',
  templateUrl: './scatter-chart.component.html',
  styleUrls: ['./scatter-chart.component.css'],
})
export class ScatterChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: any;
  @Input() height: number;
  @Input() options: any;
  @Input() xDomain: number[];
  @Input() xLabel: string = '';
  @Input() xScale: d3.scaleLinear;
  @Input() yDomain: number[];
  @Input() yLabel: string = '';
  @Input() yScale: d3.scaleLinear;
  private selector: d3.Selection;
  private subscription$: any;
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
    // console.log('Init scatter chart')
    this.subscription$ = this._chartService.update.subscribe(() => this.update())
  }

  ngOnDestroy() {
    // console.log('Destroy scatter chart')
    this.subscription$.unsubscribe()
  }

  ngOnChanges() {
    // console.log('Change scatter chart')
    let margin = this._chartService.g;
    let height = (this.height - margin.top - margin.bottom);
    this.xAxis = d3.axisBottom(this.xScale)
      .tickSize(-height);
    this.yAxis = d3.axisLeft(this.yScale)
      .tickSize(-this.xScale.range()[1]);

    this.update()
  }

  update() {
    // console.log('Update scatter chart')

    this.yAutoscale = this._chartService.yAutoscale || this.yAutoscale;
    if (this.yAutoscale) {
      this.yScale.domain(this.yDomain)
    }

    this.xAxis.scale(this.xScale).ticks(5);
    this.yAxis.scale(this.yScale).ticks(3);

    let width = this.xScale.range()[1]
    let height = this.yScale.range()[0];
    var yDomain = this.yScale.domain();
    var dy = height / (yDomain[1] - yDomain[0]) - 2;

    var canvas = this.selector.select('.dots')
    .attr('width', width)
    .attr('height', height);
    var context = canvas.node().getContext('2d');
    context.clearRect(0, 0, width, height);
    context.lineWidth = '2';
    this.data.forEach(d => {
      context.strokeStyle = this.color(d);
      var x = this.xScale(d.x);
      var y = this.yScale(d.y);
      context.beginPath();
      context.moveTo(x, y - dy / 2);
      context.lineTo(x, y + dy / 2);
      context.closePath();
      context.stroke();
    })
  }

  // tooltip(d) {
  //   return 'x:' + d.x.toFixed(1) + ', y:' + d.y.toFixed(0)
  // }

  translate(d) {
    return 'translate(' + this.xScale(d.x) + ',' + this.yScale(d.y) + ')'
  }

  color(d) {
    return (this._chartService.selected.includes(this.options.neuron2node[d.y])) ? d.c : 'black'
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
