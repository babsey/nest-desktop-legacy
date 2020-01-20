import { Component, OnInit } from '@angular/core';

import { ChartRecordsService } from '../chart-records/chart-records.service';
import { VisualizationService } from '../../visualization.service';


@Component({
  selector: 'app-chart-split-controller',
  templateUrl: './chart-split-controller.component.html',
  styleUrls: ['./chart-split-controller.component.scss']
})
export class ChartSplitControllerComponent implements OnInit {
  public useTransition: boolean = false;

  constructor(
    public _chartRecordsService: ChartRecordsService,
    public _visualizationService: VisualizationService,
  ) { }

  ngOnInit(): void {
  }

  dragEnd(event): void {
    this._chartRecordsService.panelOrder
      .filter(pp => this._chartRecordsService.panelSelected.includes(pp))
      .map((p, i) => {
        this._chartRecordsService.panel[p].size = Math.round(event.sizes[i]);
      })
    this._visualizationService.update.emit()
  }

}
