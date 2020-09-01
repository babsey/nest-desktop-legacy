import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { ActivityAnimationGraph } from '../../../components/activity/Threejs/activityAnimationGraph';
import { Project } from '../../../components/project/project';

import { ActivityGraphService } from '../../../services/activity/activity-graph.service';


@Component({
  selector: 'app-activity-animation',
  templateUrl: './activity-animation.component.html',
  styleUrls: ['./activity-animation.component.scss']
})
export class ActivityAnimationComponent implements OnInit, OnDestroy {
  @Input() project: Project;
  private _subscriptionInit: any;
  private _subscriptionUpdate: any;

  constructor(
    public activityGraphService: ActivityGraphService,
  ) { }

  ngOnInit() {
    console.log('Ng init activity animation view');
    this._subscriptionInit = this.activityGraphService.init.subscribe((project: Project) => this.init(project));
    this._subscriptionUpdate = this.activityGraphService.update.subscribe(() => this.update());
    this.init(this.project);
  }

  ngOnDestroy() {
    console.log('Ng destroy activity animation view');
    this._subscriptionInit.unsubscribe();
    this._subscriptionUpdate.unsubscribe();
  }

  init(project: Project) {
    console.log('Init activity animation view for '+ project.name);
    this.activityGraphService.graph = new ActivityAnimationGraph(project);
  }

  update(): void {
    console.log('Update activity animation view');
    this.activityGraphService.graph.update();
  }
}
