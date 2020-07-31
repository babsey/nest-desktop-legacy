import { Component, OnInit } from '@angular/core';

import { ActivityGraphConfigService } from '../../../services/activity/activity-graph-config.service';


@Component({
  selector: 'app-activity-graph-config',
  templateUrl: './activity-graph-config.component.html',
  styleUrls: ['./activity-graph-config.component.scss']
})
export class ActivityGraphConfigComponent implements OnInit {

  constructor(
    public _activityGraphConfigService: ActivityGraphConfigService,
  ) { }

  ngOnInit() {
  }

}
