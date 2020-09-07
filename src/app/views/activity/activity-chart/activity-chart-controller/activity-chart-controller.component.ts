import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { ActivityChartService } from '../../../../services/activity/activity-chart.service';
import { ActivityChartPanelService } from '../../../../services/activity/activity-chart-panel.service';


@Component({
  selector: 'app-activity-chart-controller',
  templateUrl: './activity-chart-controller.component.html',
  styleUrls: ['./activity-chart-controller.component.scss']
})
export class ActivityChartControllerComponent implements OnInit {

  constructor(
    private _activityChartPanelService: ActivityChartPanelService,
    private _activityChartService: ActivityChartService,
  ) { }

  ngOnInit() {
  }

  get panelSelected(): string[] {
    return this._activityChartPanelService.panelSelected;
  }

  get panelOrder(): string[] {
    return this._activityChartPanelService.panelOrder;
  }

  get histogram(): any {
    return this._activityChartService.graph.panels.find((panel: any) => panel.name === 'SpikeHistogram');
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.panelOrder, event.previousIndex, event.currentIndex);
    this.panelOrder.map((p,i) => {
      const yaxisIdx: number = (this.panelOrder.length - i);
      this._activityChartPanelService.panel[p]['yaxis'] = yaxisIdx;
    })
    const panelSelected: string[] = this.panelSelected;
    this._activityChartPanelService.panelSelected = [];
    setTimeout(() => {
      this._activityChartPanelService.panelSelected = panelSelected;
      setTimeout(() => this._activityChartService.update.emit(), 100)
    }, 1);

  }

  onModelChange(event): void {
    this._activityChartPanelService.panelSelected = [];
    setTimeout(() => {
      this._activityChartPanelService.panelSelected = event;
      setTimeout(() => this._activityChartService.update.emit(), 100)
    }, 1);
  }

  onBinsizeChange(value: number): void {
    this._activityChartService.update.emit();
  }

  onBarmodeChange(value: string): void {
    this._activityChartService.update.emit();
  }

  onBarnormChange(value: string): void {
    this.histogram.state.barmode = 'stack';
    this._activityChartService.update.emit();
  }

}
