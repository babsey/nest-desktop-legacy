import { Component, OnInit } from '@angular/core';

import { PlotRecordsService } from '../plot-records/plot-records.service';
import { VisualizationConfigService } from '../../visualization-config/visualization-config.service';
import { VisualizationService } from '../../visualization.service';


@Component({
  selector: 'app-plot-controller',
  templateUrl: './plot-controller.component.html',
  styleUrls: ['./plot-controller.component.scss']
})
export class PlotControllerComponent implements OnInit {

  constructor(
    public _plotRecordsService: PlotRecordsService,
    public _visualizationConfigService: VisualizationConfigService,
    public _visualizationService: VisualizationService,
  ) {
  }

  ngOnInit() {
  }

  onBinSizeChange(value: number): void {
    this._plotRecordsService.binsize = value;
    this._visualizationService.update.emit();
  }

  onBarmodeChange(value: string): void {
    this._plotRecordsService.barmode = value;
    this._visualizationService.update.emit();
  }

  onBarnormChange(value: string): void {
    this._plotRecordsService.barnorm = value;
    this._plotRecordsService.barmode = 'stack';
    this._visualizationService.update.emit();
  }

}
