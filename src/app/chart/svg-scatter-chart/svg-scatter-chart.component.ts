import { Component, Input, OnInit, OnChanges, ElementRef, OnDestroy } from '@angular/core';
import * as d3 from 'd3';

import { ChartService } from '../chart.service';

@Component({
  selector: 'app-svg-scatter-chart',
  templateUrl: './svg-scatter-chart.component.html',
  styleUrls: ['./svg-scatter-chart.component.css'],
})
export class SVGScatterChartComponent implements OnInit, OnChanges, OnDestroy {
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
    // console.log('Init SVG scatter chart')
    this.subscription = this._chartService.update.subscribe(() => this.update())
  }

  ngOnDestroy() {
    // console.log('Destroy SVG scatter chart')
    this.subscription.unsubscribe()
  }

  ngOnChanges() {
    // console.log('Change SVG scatter chart')
    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3.axisLeft(this.yScale);

    this.update()
  }

  update() {
    // console.log('Update SVG scatter chart')

    this.yAutoscale = this._chartService.yAutoscale || this.yAutoscale;
    if (this.yAutoscale) {
      this.yScale.domain(this.yDomain)
    }

    this.xAxis.scale(this.xScale).ticks(5);
    this.yAxis.scale(this.yScale).ticks(3);
  }

  tooltip(d) {
    return 'x:' + d.x.toFixed(1) + ', y:' + d.y.toFixed(0)
  }

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
