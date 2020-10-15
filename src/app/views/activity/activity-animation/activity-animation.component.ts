import { Component, OnInit, OnDestroy, Input, HostListener, ViewChild, ElementRef, } from '@angular/core';

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
  private _subscriptionUpdate: any;
  @ViewChild('datGui', { static: true }) datGuiRef: ElementRef;

  constructor(
    private _activityAnimationService: ActivityAnimationService,
  ) { }

  ngOnInit() {
    // console.log('Ng init Three scatter')
    this._subscriptionUpdate = this._activityAnimationService.update.subscribe(() => this.update());
    this.init();
  }

  ngOnDestroy() {
    // console.log('Ng destroy Three scatter');
    this._subscriptionUpdate.unsubscribe();
    this.scene.destroy();
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
    setTimeout(() => {
      this._activityAnimationService.loadScene(this.graph);
      if (this.project.app.config.devMode) {
        this.scene.addGUI(this.datGuiRef);
      }
    }, 1);
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
