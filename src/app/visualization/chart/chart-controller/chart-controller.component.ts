import { Component, OnInit } from '@angular/core';

import { ChartRecordsService } from '../chart-records/chart-records.service';
import { VisualizationConfigService } from '../../visualization-config/visualization-config.service';
import { VisualizationService } from '../../visualization.service';


@Component({
  selector: 'app-chart-controller',
  templateUrl: './chart-controller.component.html',
  styleUrls: ['./chart-controller.component.scss']
})
export class ChartControllerComponent implements OnInit {

  constructor(
    public _chartRecordsService: ChartRecordsService,
    public _visualizationConfigService: VisualizationConfigService,
    public _visualizationService: VisualizationService,
  ) {
  }

  ngOnInit() {
  }

  onBinSizeChange(value: number): void {
    this._chartRecordsService.binsize = value;
    this._visualizationService.update.emit();
  }

  onBarmodeChange(value: string): void {
    this._chartRecordsService.barmode = value;
    this._visualizationService.update.emit();
  }

  onBarnormChange(value: string): void {
    this._chartRecordsService.barnorm = value;
    this._chartRecordsService.barmode = 'stack';
    this._visualizationService.update.emit();
  }

}
