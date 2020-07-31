import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { ActivityChartService } from '../../../../services/activity/activity-chart.service';
import { ActivityGraphService } from '../../../../services/activity/activity-graph.service';


@Component({
  selector: 'app-activity-chart-controller',
  templateUrl: './activity-chart-controller.component.html',
  styleUrls: ['./activity-chart-controller.component.scss']
})
export class ActivityChartControllerComponent implements OnInit {

  constructor(
    private _activityGraphService: ActivityGraphService,
    public _activityChartService: ActivityChartService,
  ) {
  }

  ngOnInit() {
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this._activityChartService.panelOrder, event.previousIndex, event.currentIndex);
    this._activityChartService.panelOrder.map((p,i) => {
      const yaxisIdx: number = (this._activityChartService.panelOrder.length - i);
      this._activityChartService.panel[p]['yaxis'] = yaxisIdx;
    })
    const panelSelected: string[] = this._activityChartService.panelSelected;
    this._activityChartService.panelSelected = [];
    setTimeout(() => {
      this._activityChartService.panelSelected = panelSelected;
      setTimeout(() => this._activityGraphService.update.emit(), 100)
    }, 1);

  }

  onNgModelChange(event): void {
    this._activityChartService.panelSelected = [];
    setTimeout(() => {
      this._activityChartService.panelSelected = event;
      setTimeout(() => this._activityGraphService.init.emit(), 100)
    }, 1);
  }

  onThresholdChange(value: number): void {
    this._activityChartService.threshold.value = value;
    this._activityGraphService.update.emit();
  }

  onBinSizeChange(value: number): void {
    this._activityChartService.binsize = value;
    this._activityGraphService.update.emit();
  }

  onBarmodeChange(value: string): void {
    this._activityChartService.barmode = value;
    this._activityGraphService.update.emit();
  }

  onBarnormChange(value: string): void {
    this._activityChartService.barnorm = value;
    this._activityChartService.barmode = 'stack';
    this._activityGraphService.update.emit();
  }

}
