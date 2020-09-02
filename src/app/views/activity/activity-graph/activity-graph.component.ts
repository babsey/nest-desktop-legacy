import { Component, OnInit, Input } from '@angular/core';

import { Project } from '../../../components/project/project';

import { ActivityGraphService } from '../../../services/activity/activity-graph.service';
import { SimulationRunService } from '../../../services/simulation/simulation-run.service';


@Component({
  selector: 'app-activity-graph',
  templateUrl: './activity-graph.component.html',
  styleUrls: ['./activity-graph.component.scss']
})
export class ActivityGraphComponent implements OnInit {
  @Input() project: Project;

  constructor(
    private _activityGraphService: ActivityGraphService,
    private _simulationRunService: SimulationRunService,
  ) { }

  ngOnInit() {
  }

  get mode(): string {
    return this._activityGraphService.mode;
  }

  set mode(value: string) {
    this._activityGraphService.mode = value;
  }

  get running(): boolean {
    return this._simulationRunService.running;
  }

}
