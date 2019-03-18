import { Component, OnInit, Input } from '@angular/core';

import * as d3 from 'd3';


@Component({
  selector: 'app-isi-chart',
  templateUrl: './isi-chart.component.html',
  styleUrls: ['./isi-chart.component.css']
})
export class IsiChartComponent implements OnInit {
  @Input() senders: any;
  @Input() data: any;
  @Input() xScale: d3.scaleLinear;
  @Input() yScale: d3.scaleLinear;


  constructor() { }

  ngOnInit() {
  }

  update() {

    // var xDomain = this.xScale.domain();
    // var data = this.data.filter(d => (d.x > xDomain[0] && d.x < xDomain[1]))
    //
    // var dataGrouped = Array(senders.length).fill([]);
    // data.map(d => {
    //   var idx = senders.indexOf(d.y);
    //   dataGrouped[idx].push(d.x);
    // })
    //
    // dataGrouped.map(d => {
    //   d.sort()
    //   var isi = [];
    //   for (var i=0;i<d.length-1;i++) {
    //     isi.push(d[i+1] - d[i])
    //   }
    // })
    //
    // let histogram = d3.histogram()
    //   .domain([0,200])
    //   .thresholds(xTicks);
    //
    //     let hist = histogram(data);


  }

}
