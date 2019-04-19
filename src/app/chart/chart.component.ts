import { Component, OnInit, Input, ElementRef, HostListener } from '@angular/core';

import { ChartService } from './chart.service';
import { DataService } from '../services/data/data.service';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @Input() height: number = 0;
  @Input() width: number = 0;

  @HostListener('window:resize') onResize() {
    // guard against resize before view is rendered
    this.height = this.elementRef.nativeElement.parentNode.clientHeight;
    this.width = this.elementRef.nativeElement.parentNode.clientWidth;
  }

  constructor(
    public _chartService: ChartService,
    public _dataService: DataService,
    private elementRef: ElementRef,
  ) {
  }

  ngOnInit() {
  }

  hasSpikeData(model) {
    return model == 'spike_detector';
  }

  hasAnalogData(model) {
    return ['multimeter', 'voltmeter'].includes(model);
  }

}
