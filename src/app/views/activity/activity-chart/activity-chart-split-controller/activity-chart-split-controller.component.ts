import { Component, OnInit } from '@angular/core';

import { ActivityChartPanelService } from '../../../../services/activity/activity-chart-panel.service';
import { ActivityGraphService } from '../../../../services/activity/activity-graph.service';


@Component({
  selector: 'app-activity-chart-split-controller',
  templateUrl: './activity-chart-split-controller.component.html',
  styleUrls: ['./activity-chart-split-controller.component.scss']
})
export class ActivityChartSplitControllerComponent implements OnInit {

  constructor(
    private _activityChartPanelService: ActivityChartPanelService,
    private _activityGraphService: ActivityGraphService,
  ) { }

  ngOnInit() {
  }

  get panelOrder(): string[] {
    return this._activityChartPanelService.panelOrder;
  }

  get panel(): any {
    return this._activityChartPanelService.panel;
  }

  get panelSelected(): string[] {
    return this._activityChartPanelService.panelSelected;
  }

  dragEnd(event): void {
    this.panelOrder
      .filter((panel: string) => this.panelSelected.includes(panel))
      .forEach((panel: string, idx: number) => {
        this.panel[panel].size = Math.round(event.sizes[idx]);
      })
    // this._activityChartPanelService.update.emit()
  }

}
