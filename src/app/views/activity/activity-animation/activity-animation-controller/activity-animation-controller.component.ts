import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

import { ActivityAnimationGraph } from '../../../../components/activity/activityAnimationGraph';

import { ActivityAnimationService } from '../../../../services/activity/activity-animation.service';


@Component({
  selector: 'app-activity-animation-controller',
  templateUrl: './activity-animation-controller.component.html',
  styleUrls: ['./activity-animation-controller.component.scss']
})
export class ActivityAnimationControllerComponent implements OnInit {
  private _trailModes: string[] = ['off', 'growing', 'shrinking'];

  constructor(
    private _activityAnimationService: ActivityAnimationService,
  ) { }

  ngOnInit() {
  }

  get graph(): ActivityAnimationGraph {
    return this._activityAnimationService.graph;
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

  sampleRate(): number {
    return this.graph.config.frames.sampleRate;
  }

  onChange(event: any): void {
    this._activityAnimationService.update.emit();
  }

  onAnimationChange(event: any): void {
    if (this.graph.config.frames.speed === 0) {
      this._activityAnimationService.update.emit();
    }
  }

  onCameraChange(): void {
    this.graph.config.camera.control = true;
  }

  step(): void {
    this.graph.step();
    this._activityAnimationService.update.emit();
  }

  stepBackward(): void {
    this.graph.stepBackward();
    this._activityAnimationService.update.emit();
  }

}
