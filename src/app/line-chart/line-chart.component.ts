// https://bl.ocks.org/mbostock/3883245
import {
  Component,
  Input,
  OnInit,
  OnChanges
} from '@angular/core';
import * as d3 from 'd3';

import { ChartService } from '../shared/services/chart/chart.service';

@Component({
  selector: 'g[app-line-chart]',
  template: '',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit, OnChanges {
  private margin: any;
  private width: any;
  private height: any;
  private xScale: any;
  private yScale: any;
  private xAxis: any;
  private yAxis: any;
  private line: any;
  @Input() data: any;
  @Input() options: any;

  constructor(private service: ChartService) {
    this.margin = { top: 20, right: 20, bottom: 30, left: 50 };
    this.width = 800 - this.margin.left - this.margin.right;
    this.height = 600 - this.margin.top - this.margin.bottom;

    this.xScale = d3.scaleLinear().domain([0, 1]).range([0, this.width]);
    this.yScale = d3.scaleLinear().domain([0, 1]).range([this.height, 0]);
    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3.axisLeft(this.yScale);

    this.line = d3.line()
      .x((d) => this.xScale(d.x))
      .y((d) => this.yScale(d.y));
  }

  ngOnInit() {
    this.xScale.domain(this.options.xDomain);
    this.yScale.domain(this.options.yDomain);

    var selector = d3.select('g[app-trace-chart]').append('g')
      .attr('class', 'line-chart')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')

    selector.append('rect')
      .attr('class', 'overlay')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('fill', 'white')
      .style('opacity', 0);

    selector.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.xAxis);

    selector.append('g')
      .attr('class', 'axis axis--y')
      .call(this.yAxis);

    selector.call(
      d3.drag()
        .on("drag", () => {
          var yDomain = this.yScale.domain();
          var xDomain = this.xScale.domain();
          var xRange = this.xScale.range();
          var dxDomain = xDomain[1] - xDomain[0];
          var dx = d3.event.dx * dxDomain / (xRange[1] - xRange[0]);
          this.xScale.domain([xDomain[0] - dx, xDomain[1] - dx]);
          this.update()
        })
    )

    selector.call(
      d3.zoom()
        .scaleExtent([.5, 5])
        .extent([[0, 0], [this.width, this.height]])
        .on("zoom", () => {
          this.xScale = d3.event.transform.rescaleX(this.xScale);
          // this.yScale = d3.event.transform.rescaleY(this.yScale);
          this.update()
        })
    )

    this.update()
  }

  ngOnChanges() {
    // if (this.xScale) {
    //   this.xScale.domain(d3.extent(this.data, (d) => d.x))
    //   this.yScale.domain(d3.extent(this.data, (d) => d.y))
    // }
    this.update()
  }

  update() {
    var data = this.data.map((d) => d.filter(dd => {
      var xDomain = this.xScale.domain();
      return xDomain[0] < dd.x && dd.x < xDomain[1]
    }));
    var selector = d3.select('g.line-chart');
    selector.select('.axis--x').call(this.xAxis.scale(this.xScale));
    selector.select('.axis--y').call(this.yAxis.scale(this.yScale));
    var lines = selector.selectAll('.line').data(data);

    lines.exit().remove();

    lines = lines.enter().append('path')
      .attr('class', 'line')
      .attr('stroke', 'black')
      .attr('fill', 'none')
      .merge(lines)
      .attr('d', this.line);
  }
}
