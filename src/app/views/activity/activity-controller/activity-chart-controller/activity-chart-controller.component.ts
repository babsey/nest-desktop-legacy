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
    public activityChartService: ActivityChartService,
  ) {
  }

  ngOnInit() {
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.activityChartService.panelOrder, event.previousIndex, event.currentIndex);
    this.activityChartService.panelOrder.map((p,i) => {
      const yaxisIdx: number = (this.activityChartService.panelOrder.length - i);
      this.activityChartService.panel[p]['yaxis'] = yaxisIdx;
    })
    const panelSelected: string[] = this.activityChartService.panelSelected;
    this.activityChartService.panelSelected = [];
    setTimeout(() => {
      this.activityChartService.panelSelected = panelSelected;
      setTimeout(() => this._activityGraphService.update.emit(), 100)
    }, 1);

  }

  onNgModelChange(event): void {
    this.activityChartService.panelSelected = [];
    setTimeout(() => {
      this.activityChartService.panelSelected = event;
      setTimeout(() => this._activityGraphService.init.emit(), 100)
    }, 1);
  }

  onThresholdChange(value: number): void {
    this.activityChartService.threshold.value = value;
    this._activityGraphService.update.emit();
  }

  onBinSizeChange(value: number): void {
    this.activityChartService.binsize = value;
    this._activityGraphService.update.emit();
  }

  onBarmodeChange(value: string): void {
    this.activityChartService.barmode = value;
    this._activityGraphService.update.emit();
  }

  onBarnormChange(value: string): void {
    this.activityChartService.barnorm = value;
    this.activityChartService.barmode = 'stack';
    this._activityGraphService.update.emit();
  }

}
