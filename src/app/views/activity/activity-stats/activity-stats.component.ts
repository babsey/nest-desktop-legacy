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
  public selectedActivity: Activity;
  public recordFrom: string[] = ['V_m'];
  public selectedRecord: string = 'V_m';

  constructor(
  ) { }

  ngOnInit() {
  }

  select(activity: Activity): void {
    this.selectedActivity = activity;
    if (activity.recorder.model.existing === 'multimeter') {
      this.recordFrom = activity.recorder.getParameter('record_from').value || ['V_m'];
      this.selectedRecord = this.recordFrom[0];
    }
  }

  unselect(): void {
    this.selectedActivity = undefined;
    this.recordFrom = ['V_m'];
    this.selectedRecord = 'V_m';
  }

}
