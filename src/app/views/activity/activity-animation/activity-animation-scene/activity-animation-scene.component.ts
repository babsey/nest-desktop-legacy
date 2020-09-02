import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';

import { ActivityAnimationGraph } from '../../../../components/activity/Threejs/activityAnimationGraph';
import { ActivityAnimationScene } from '../../../../components/activity/Threejs/activityAnimationScene';

import { ActivityAnimationService } from '../../../../services/activity/activity-animation.service';



@Component({
  selector: 'app-activity-animation-scene',
  templateUrl: './activity-animation-scene.component.html',
  styleUrls: ['./activity-animation-scene.component.scss']
})
export class ActivityAnimationSceneComponent implements OnInit, OnDestroy {
  @Input() graph: ActivityAnimationGraph;
  // @Input() config: any = {};
  private _scene: ActivityAnimationScene;
  private _subscriptionInit: any;
  private _subscriptionUpdate: any;

  constructor(
    private _activityAnimationService: ActivityAnimationService,
  ) { }

  ngOnInit() {
    // console.log('Ng init Three scatter')
    this._subscriptionInit = this._activityAnimationService.init.subscribe(() => setTimeout(() => this.init(), 1));
    this._subscriptionUpdate = this._activityAnimationService.update.subscribe(() => this.update());
    this.init();
  }

  ngOnDestroy() {
    // console.log('Ng destroy Three scatter');
    this.clear();
    this._subscriptionInit.unsubscribe();
    this._subscriptionUpdate.unsubscribe();
  }

  get config(): any {
    return this.graph.config;
  }

  init(): void {
    // console.log('Init Three scatter');
    this.clear();
    setTimeout(() => {
      this._scene = new ActivityAnimationScene(this.graph, 'activityAnimationScene');
    }, 100);
  }

  clear(): void {
    // console.log('Clear Three scatter');
    if (this._scene) {
      this._scene.stop();
      this._scene.clear();
    }
  }

  update(): void {
    // console.log('Update Three scatter');
    this._scene.frameUpdate();
  }

  onMouseDown(event: MouseEvent): void {
    this.config.camera.control = false;
  }

  onDblClick(event: MouseEvent): void {
    this.config.camera.rotation.theta = 0;
    this.config.camera.control = true;
  }

  @HostListener('window:resize', [])
  resize(): void {
    if (this._scene) {
      this._scene.resize();
    }
  }

}
