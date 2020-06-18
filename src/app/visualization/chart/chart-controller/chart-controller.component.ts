import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


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

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this._chartRecordsService.panelOrder, event.previousIndex, event.currentIndex);
    this._chartRecordsService.panelOrder.map((p,i) => {
      var yaxisIdx = (this._chartRecordsService.panelOrder.length - i);
      this._chartRecordsService.panel[p]['yaxis'] = yaxisIdx;
    })
    var panelSelected = this._chartRecordsService.panelSelected;
    this._chartRecordsService.panelSelected = [];
    setTimeout(() => {
      this._chartRecordsService.panelSelected = panelSelected;
      setTimeout(() => this._visualizationService.update.emit(), 100)
    }, 1);

  }

  onNgModelChange(event): void {
    this._chartRecordsService.panelSelected = [];
    setTimeout(() => {
      this._chartRecordsService.panelSelected = event;
      setTimeout(() => this._visualizationService.init.emit(), 100)
    }, 1);
  }

  onThresholdChange(value: number): void {
    this._chartRecordsService.threshold.value = value;
    this._visualizationService.update.emit();
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
