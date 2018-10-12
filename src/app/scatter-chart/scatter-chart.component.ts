import {
  Component,
  Input,
  OnInit,
  OnChanges,
} from '@angular/core';
import * as d3 from 'd3';

import { ChartService } from '../shared/services/chart/chart.service';


@Component({
  selector: 'g[app-scatter-chart]',
  template: '',
  styleUrls: ['./scatter-chart.component.css'],
})
export class ScatterChartComponent implements OnInit, OnChanges {
  private margin: any;
  private width: any;
  private height: any;
  private xScale: any;
  private yScale: any;
  private xAxis: any;
  private yAxis: any;
  @Input() data: any;

  constructor(private service: ChartService) {
    this.margin = { top: 20, right: 20, bottom: 30, left: 50 };
    this.width = 800 - this.margin.left - this.margin.right;
    this.height = 600 - this.margin.top - this.margin.bottom;

    this.xScale = d3.scaleLinear().domain([0, 1]).range([0, this.width]);
    this.yScale = d3.scaleLinear().domain([0, 1]).range([this.height, 0]);
    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3.axisLeft(this.yScale);
  }


  ngOnInit() {
    var xDomain = d3.extent(this.data, (d) => d.x);
    var yDomain = d3.extent(this.data, (d) => d.y);
    this.xScale.domain(xDomain);
    this.yScale.domain([yDomain[0] - 0.5, yDomain[1] + 0.5]);

    var selector = d3.select('g[app-spike-chart]').append('g')
      .attr('class', 'scatter-chart')
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
          var xDomain = this.xScale.domain();
          var xRange = this.xScale.range();
          var dxDomain = xDomain[1] - xDomain[0];
          var dx = d3.event.dx * dxDomain / (xRange[1] - xRange[0]);
          this.xScale.domain([xDomain[0] - dx, xDomain[1] - dx]);
          d3.select('.axis--x').call(this.xAxis.scale(this.xScale));
          this.update()
        })
    )

    selector.call(
      d3.zoom()
        .scaleExtent([.5, 5])
        .extent([[0, 0], [this.width, this.height]])
        .on("zoom", () => {
          this.xScale = d3.event.transform.rescaleX(this.xScale);
          d3.select('.axis--x').call(this.xAxis.scale(this.xScale));
          // this.yScale = d3.event.transform.rescaleY(this.yScale);
          // d3.select('.axis--y').call(yAxis.scale(this.yScale));
          this.update()
        })
    )

    this.update()
  }

  ngOnChanges() {
    if (this.xScale) {
      this.xScale.domain(d3.extent(this.data, (d) => d.x))
      this.yScale.domain(d3.extent(this.data, (d) => d.y))
    }
    this.update()
  }

  update() {
    var data = this.data.filter(d => {
      var xDomain = this.xScale.domain();
      return xDomain[0] < d.x && d.x < xDomain[1]
    })
    var selector = d3.select('g.scatter-chart');
    selector.select('.axis--x').call(this.xAxis.scale(this.xScale));
    selector.select('.axis--y').call(this.yAxis.scale(this.yScale));
    var dots = selector.selectAll('.dot').data(data);

    dots.exit().remove();

    dots = dots.enter().append('circle')
      .attr('class', 'dot')
      .attr('fill', 'black')
      .attr('r', 2)
      .merge(dots)
      .attr('cx', d => this.xScale(d.x))
      .attr('cy', d => this.yScale(d.y));
  }
}
