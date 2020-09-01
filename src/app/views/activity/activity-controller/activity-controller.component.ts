import { Component, OnInit } from '@angular/core';

import { ActivityGraphService } from '../../../services/activity/activity-graph.service';

@Component({
  selector: 'app-activity-controller',
  templateUrl: './activity-controller.component.html',
  styleUrls: ['./activity-controller.component.scss']
})
export class ActivityControllerComponent implements OnInit {

  constructor(
    public activityGraphService: ActivityGraphService,
  ) { }

  ngOnInit() {
  }

}
