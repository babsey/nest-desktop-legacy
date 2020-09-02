import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Network } from '../../../components/network/network';
import { Project } from '../../../components/project/project';

import { ActivityGraphService } from '../../../services/activity/activity-graph.service';
import { ProjectService } from '../../../services/project/project.service';


@Component({
  selector: 'app-project-sidenav',
  templateUrl: './project-sidenav.component.html',
  styleUrls: ['./project-sidenav.component.scss']
})
export class ProjectSidenavComponent implements OnInit {
  @Input() project: Project;

  constructor(
    private _activityGraphService: ActivityGraphService,
    private _projectService: ProjectService,
  ) { }

  ngOnInit() {
  }

  get mode(): string {
    return this._projectService.sidenavMode;
  }

  get graphMode(): string {
    return this._activityGraphService.mode;
  }

  isGraphLoaded(): boolean {
    return this._activityGraphService.isGraphLoaded();
  }

}
