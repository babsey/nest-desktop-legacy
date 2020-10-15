import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';


import { ActivityAnimationGraph } from '../../../components/activity/activityAnimationGraph';
import { ActivityAnimationScene } from '../../../components/activity/animationScenes/activityAnimationScene';
import { ActivityAnimationSceneBox } from '../../../components/activity/animationScenes/activityAnimationSceneBox';
import { ActivityAnimationSceneSphere } from '../../../components/activity/animationScenes/activityAnimationSceneSphere';
import { Project } from '../../../components/project/project';

import { ActivityAnimationService } from '../../../services/activity/activity-animation.service';


@Component({
  selector: 'app-activity-animation',
  templateUrl: './activity-animation.component.html',
  styleUrls: ['./activity-animation.component.scss']
})
export class ActivityAnimationComponent implements OnInit {
  @Input() project: Project;
  private _scene: ActivityAnimationSceneBox | ActivityAnimationSceneSphere;
  private _subscriptionInit: any;
  private _subscriptionUpdate: any;

  constructor(
    private _activityAnimationService: ActivityAnimationService,
  ) { }

  ngOnInit() {
    // console.log('Ng init Three scatter')
    this._subscriptionInit = this._activityAnimationService.init.subscribe(() =>
      setTimeout(() => this.init(), 1));
    this._subscriptionUpdate = this._activityAnimationService.update.subscribe(
      () => this.update());

    setTimeout(() => this.init(), 1);
  }

  ngOnDestroy() {
    // console.log('Ng destroy Three scatter');
    this.clear();
    this._subscriptionInit.unsubscribe();
    this._subscriptionUpdate.unsubscribe();
  }

  get config(): any {
    return this.scene.graph.config;
  }

  get graph(): ActivityAnimationGraph {
    return this.project.activityAnimationGraph;
  }

  get scene(): ActivityAnimationScene {
    return this._activityAnimationService.scene;
  }

  init(): void {
    // console.log('Init activity animation scene');
    this._activityAnimationService.initScene(this.graph);
  }

  clear(): void {
    // console.log('Clear activity animation scene');
    this.scene.stop();
    this.scene.clear();
  }

  update(): void {
    // console.log('Update activity animation scene');
    this.scene.update();
  }

  onDblClick(event: MouseEvent): void {
    this.scene.updateCameraPosition();
  }

  @HostListener('window:resize', [])
  resize(): void {
    if (this.scene) {
      this.scene.resize();
    }
  }

}
