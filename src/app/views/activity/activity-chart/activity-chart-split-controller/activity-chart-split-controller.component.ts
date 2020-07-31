import { Component, OnInit } from '@angular/core';

import { ActivityChartService } from '../../../../services/activity/activity-chart.service';
import { ActivityGraphService } from '../../../../services/activity/activity-graph.service';


@Component({
  selector: 'app-activity-chart-split-controller',
  templateUrl: './activity-chart-split-controller.component.html',
  styleUrls: ['./activity-chart-split-controller.component.scss']
})
export class ActivityChartSplitControllerComponent implements OnInit {
  public useTransition: boolean = false;

  constructor(
    public _activityChartService: ActivityChartService,
    private _activityGraphService: ActivityGraphService,
  ) { }

  ngOnInit() {
  }

  dragEnd(event): void {
    this._activityChartService.panelOrder
      .filter(pp => this._activityChartService.panelSelected.includes(pp))
      .map((p, i) => {
        this._activityChartService.panel[p].size = Math.round(event.sizes[i]);
      })
    this._activityGraphService.update.emit()
  }

}
