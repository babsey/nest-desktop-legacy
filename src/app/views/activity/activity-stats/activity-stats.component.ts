import { Component, OnInit, Input } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { Activity } from '../../../components/activity/activity';
import { Model } from '../../../components/model/model';
import { Project } from '../../../components/project/project';


@Component({
  selector: 'app-activity-stats',
  templateUrl: './activity-stats.component.html',
  styleUrls: ['./activity-stats.component.scss']
})
export class ActivityStatsComponent implements OnInit {
  @Input() project: Project;
  public selectedIdx: number;
  public selectedModel: Model;
  public recordFrom: string[] = ['V_m'];
  public selectedRecord: string = 'V_m';

  constructor(
  ) { }

  ngOnInit() {
  }

  colorSelected(): string {
    if (this.selectedIdx == undefined) return 'black'
    const activity: Activity = this.project.activities[this.selectedIdx];
    return activity.recorder.view.color;
  }

  select(activity: Activity): void {
    this.selectedIdx = activity.idx;
    this.selectedModel = activity.recorder.model;
    if (this.selectedModel.existing === 'multimeter') {
      this.recordFrom = activity.recorder.getParameter('record_from').value || ['V_m'];
      this.selectedRecord = this.recordFrom[0];
    }
  }

  unselect(): void {
    this.selectedIdx = undefined;
    this.selectedModel = undefined;
    this.recordFrom = ['V_m'];
    this.selectedRecord = 'V_m';
  }

}
