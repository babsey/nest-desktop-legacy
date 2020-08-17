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
    public _activityGraphService: ActivityGraphService,
  ) {
  }

  ngOnInit() {
    console.log('Ng init activity animation view');
    this._subscriptionInit = this._activityGraphService.init.subscribe(() => this.init());
    this._subscriptionUpdate = this._activityGraphService.update.subscribe(() => this.update());
    this.init();
  }

  ngOnDestroy() {
    console.log('Ng destroy activity animation view');
    this._subscriptionInit.unsubscribe();
    this._subscriptionUpdate.unsubscribe();
  }

  init() {
    console.log('Init activity animation view');
    this._activityGraphService.graph = new ActivityAnimationGraph(this.project);
  }

  update(): void {
    console.log('Update activity animation view');
    this._activityGraphService.graph.update();
  }
}
