import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { ActivityAnimationGraph } from '../../../components/activity/activityAnimationGraph';
import { Project } from '../../../components/project/project';

import { ActivityAnimationService } from '../../../services/activity/activity-animation.service';


@Component({
  selector: 'app-activity-animation',
  templateUrl: './activity-animation.component.html',
  styleUrls: ['./activity-animation.component.scss']
})
export class ActivityAnimationComponent implements OnInit, OnDestroy {
  @Input() project: Project;
  // private _subscriptionInit: any;
  // private _subscriptionUpdate: any;

  constructor(
    private _activityAnimationService: ActivityAnimationService,
  ) { }

  ngOnInit() {
    // console.log('Ng init activity animation view');
    // this._subscriptionInit = this._activityAnimationService.init.subscribe((project: Project) => this.init(project));
    // this._subscriptionUpdate = this._activityAnimationService.update.subscribe(() => this.update());
    // this.init();
    setTimeout(() => {
      this._activityAnimationService.graph = new ActivityAnimationGraph(this.project);
    }, 1);
  }

  ngOnDestroy() {
    // console.log('Ng destroy activity animation view');
    // this._subscriptionInit.unsubscribe();
    // this._subscriptionUpdate.unsubscribe();
  }

  get graph(): ActivityAnimationGraph {
    return this._activityAnimationService.graph;
  }

  // init(): void {
  //   // console.log('Init activity animation view for '+ project.name);
  //   this._activityAnimationService.graph = new ActivityAnimationGraph(this.project);
  // }

  // update(): void {
  //   // console.log('Update activity animation view');
  //   this.graph.update();
  // }
}
