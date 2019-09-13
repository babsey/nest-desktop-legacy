import { Component, OnInit } from '@angular/core';

import { VisualizationConfigService } from '../../visualization-config/visualization-config.service';
import { RecordsVisualizationService } from '../../records-visualization/records-visualization.service';


@Component({
  selector: 'app-chart-controller',
  templateUrl: './chart-controller.component.html',
  styleUrls: ['./chart-controller.component.scss']
})
export class ChartControllerComponent implements OnInit {

  constructor(
    public _visualizationConfigService: VisualizationConfigService,
    public _recordsVisualizationService: RecordsVisualizationService,
  ) {
  }

  ngOnInit() {
  }

  onBinSizeChange(value) {
    this._recordsVisualizationService.binsize = value;
    this._recordsVisualizationService.init.emit();
  }

  onBarmodeChange(value) {
    this._recordsVisualizationService.barmode = value;
    this._recordsVisualizationService.init.emit();
  }

  onBarnormChange(value) {
    this._recordsVisualizationService.barmode = 'stack';
    this._recordsVisualizationService.barnorm = value;
    this._recordsVisualizationService.init.emit();
  }

}
