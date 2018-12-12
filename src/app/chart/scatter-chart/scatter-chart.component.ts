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
  public xAxis: any;
  public yAutoscale: any = true;
  public yAxis: any;

  constructor(
    public _chartService: ChartService,
    private elementRef: ElementRef,
  ) {
    this.selector = d3.select(this.elementRef.nativeElement);
  }

  ngOnInit() {
    // console.log('Init scatter chart')
    this.subscription = this._chartService.update.subscribe(() => this.update())
  }

  ngOnDestroy() {
    // console.log('Destroy scatter chart')
    this.subscription.unsubscribe()
  }

  ngOnChanges() {
    // console.log('Change scatter chart')
    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3.axisLeft(this.yScale);

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
    var canvas = this.selector.select('.dots')
      .attr('width', width)
      .attr('height', height);
    var context = canvas.node().getContext('2d');
    context.clearRect(0, 0, width, height);
    this.data.forEach(d => {
      var cx = this.xScale(d.x);
      var cy = this.yScale(d.y);
      context.beginPath();
      context.arc(cx, cy, 2, 0, 2 * Math.PI);
      context.closePath();
      context.fillStyle = this.fill(d);
      context.fill();
      context.fill();
      // context.stroke();
    })
  }

  // tooltip(d) {
  //   return 'x:' + d.x.toFixed(1) + ', y:' + d.y.toFixed(0)
  // }

  translate(d) {
    return 'translate(' + this.xScale(d.x) + ',' + this.yScale(d.y) + ')'
  }

  fill(d) {
    var senderIdx = this.options.senders.indexOf(d.y);
    return (this._chartService.selected.includes(this.options.global_ids[senderIdx])) ? d.c : 'black'
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
