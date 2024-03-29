import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';

import { ActivityAnimationGraph } from '../../../../components/activity/activityAnimationGraph';
import { ActivityAnimationScene } from '../../../../components/activity/animationScenes/activityAnimationScene';
import { Project } from '../../../../components/project/project';

import { ActivityAnimationService } from '../../../../services/activity/activity-animation.service';


@Component({
  selector: 'app-activity-animation-controller',
  templateUrl: './activity-animation-controller.component.html',
  styleUrls: ['./activity-animation-controller.component.scss']
})
export class ActivityAnimationControllerComponent implements OnInit {
  @Input() project: Project;
  private _trailModes: string[] = ['off', 'growing', 'shrinking'];

  constructor(
    private _activityAnimationService: ActivityAnimationService,
  ) { }

  ngOnInit() {
  }

  get graph(): ActivityAnimationGraph {
    return this.project.activityAnimationGraph;
  }

  get scene(): ActivityAnimationScene {
    return this._activityAnimationService.scene;
  }

  get scenes(): any[] {
    return this._activityAnimationService.scenes;
  }

  get sceneIdx(): number {
    return this._activityAnimationService.selectedSceneIdx;
  }

  set sceneIdx(value: number) {
    this.scene.destroy();
    this._activityAnimationService.selectedSceneIdx = value;
    this._activityAnimationService.loadScene(this.graph);
  }

  get trailModes(): string[] {
    return this._trailModes;
  }

  hideIncrementBadge(): boolean {
    return this.graph.config.frames.speed < 2;
  }

  hideDecrementBadge(): boolean {
    return this.graph.config.frames.speed > -2;
  }

  onChange(event: any): void {
    // console.log(event);
    if (this.graph.config.frames.speed === 0) {
      this.scene.renderFrame();
    }
  }

  onCameraChange(): void {
    this.graph.config.camera.control = true;
  }

  onFrameRateChange(event: any): void {
    // console.log(event);
    this.scene.stop();
    this.scene.animate();
    this.scene.graph.play();
  }

  onGridChange(event: any): void {
    // console.log(event);
    this.scene.initActivityLayers();
    this.scene.renderFrame();
  }

  step(): void {
    this.graph.step();
    this.scene.renderFrame();
  }

  stepBackward(): void {
    this.graph.stepBackward();
    this.scene.renderFrame();
  }

}
