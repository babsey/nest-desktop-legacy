import { Component, OnInit } from '@angular/core';

import { ActivityChartPanelService } from '../../../../services/activity/activity-chart-panel.service';
import { ActivityGraphService } from '../../../../services/activity/activity-graph.service';


@Component({
  selector: 'app-activity-chart-split-controller',
  templateUrl: './activity-chart-split-controller.component.html',
  styleUrls: ['./activity-chart-split-controller.component.scss']
})
export class ActivityChartSplitControllerComponent implements OnInit {
  public useTransition: boolean = false;

  constructor(
    public activityChartPanelService: ActivityChartPanelService,
    private _activityGraphService: ActivityGraphService,
  ) { }

  ngOnInit() {
  }

  dragEnd(event): void {
    this.activityChartPanelService.panelOrder
      .filter(pp => this.activityChartPanelService.panelSelected.includes(pp))
      .map((p, i) => {
        this.activityChartPanelService.panel[p].size = Math.round(event.sizes[i]);
      })
    // this._activityChartPanelService.update.emit()
  }

}
