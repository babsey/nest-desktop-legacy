import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';

import { ActivityAnimationGraph } from '../../../../components/activity/activityAnimationGraph';
import { ActivityScatterAnimationScene } from '../../../../components/activity/animationScenes/activityScatterAnimationScene';

import { ActivityAnimationService } from '../../../../services/activity/activity-animation.service';



@Component({
  selector: 'app-activity-animation-scene',
  templateUrl: './activity-animation-scene.component.html',
  styleUrls: ['./activity-animation-scene.component.scss']
})
export class ActivityAnimationSceneComponent implements OnInit, OnDestroy {
  @Input() graph: ActivityAnimationGraph;
  // @Input() config: any = {};
  private _scene: ActivityScatterAnimationScene;
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

    this.init();
  }

  ngOnDestroy() {
    // console.log('Ng destroy Three scatter');
    this.clear();
    this._subscriptionInit.unsubscribe();
    this._subscriptionUpdate.unsubscribe();
  }

  get config(): any {
    return this._scene.graph.config;
  }

  init(): void {
    // console.log('Init activity animation scene');
    this.clear();
    this._scene = new ActivityScatterAnimationScene(this.graph, 'activityAnimationScene');
  }

  clear(): void {
    // console.log('Clear activity animation scene');
    if (this._scene) {
      this._scene.stop();
      this._scene.clear();
    }
  }

  update(): void {
    // console.log('Update activity animation scene');
    this._scene.graph.update();
    this._scene.update();
  }

  onDblClick(event: MouseEvent): void {
    this._scene.updateCameraPosition();
  }

  @HostListener('window:resize', [])
  resize(): void {
    if (this._scene) {
      this._scene.resize();
    }
  }

}
