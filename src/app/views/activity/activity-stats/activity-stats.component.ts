import { Component, OnInit, Input } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { Activity } from '../../../components/activity/activity';
import { Model } from '../../../components/model/model';
import { Project } from '../../../components/project/project';

import { ActivityStatsService } from '../../../services/activity/activity-stats.service';



@Component({
  selector: 'app-activity-stats',
  templateUrl: './activity-stats.component.html',
  styleUrls: ['./activity-stats.component.scss']
})
export class ActivityStatsComponent implements OnInit {
  @Input() project: Project;
  private _recordFrom: string[] = ['V_m'];
  private _selectedRecord: string = 'V_m';

  constructor(
    private _activityStatsService: ActivityStatsService,
  ) { }

  ngOnInit() {
  }

  get recordFrom(): string[] {
    return this._recordFrom;
  }

  get selectedActivity(): Activity {
    return this._activityStatsService.selectedActivity;
  }

  set selectedActivity(activity: Activity) {
    this.unselect();
    this._activityStatsService.selectedActivity = activity;
    if (activity.recorder.model.existing === 'multimeter') {
      this._recordFrom = activity.recorder.getParameter('record_from').value || ['V_m'];
      this._selectedRecord = this.recordFrom[0];
    }
  }

  get selectedRecord(): string {
    return this._selectedRecord;
  }

  unselect(): void {
    this._activityStatsService.reset();
    this._recordFrom = ['V_m'];
    this._selectedRecord = 'V_m';
  }

}
