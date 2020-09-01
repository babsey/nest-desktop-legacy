import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

import { ActivityGraphService } from '../../../../services/activity/activity-graph.service';


@Component({
  selector: 'app-activity-animation-controller',
  templateUrl: './activity-animation-controller.component.html',
  styleUrls: ['./activity-animation-controller.component.scss']
})
export class ActivityAnimationControllerComponent implements OnInit {
  public trailModes: string[] = ['off', 'growing', 'shrinking', 'temporal'];

  constructor(
    private _activityGraphService: ActivityGraphService,
  ) { }

  ngOnInit() {
  }

  get graph(): any {
    return this._activityGraphService.graph;
  }

  increment(): void {
    this.graph.config.frames.speed += 1;
  }

  hideIncrementBadge(): boolean {
    return this.graph.config.frames.speed < 2;
  }

  decrement(): void {
    this.graph.config.frames.speed -= 1;
  }

  hideDecrementBadge(): boolean {
    return this.graph.config.frames.speed > -2;
  }

  sampleRate(): number {
    return this.graph.config.frames.sampleRate;
  }

  onChange(event: any): void {
    this._activityGraphService.update.emit()
  }

  onAnimationChange(event: any): void {
    if (this.graph.config.frames.speed === 0) {
      this._activityGraphService.update.emit()
    }
  }

  onCameraChange(): void {
    this.graph.config.camera.control = true;
  }

  backplay(): void {
    this.graph.config.frames.speed = -1;
  }

  backstep(): void {
    const frames: any = this.graph.config.frames;
    const framesLength: number = this.graph.frames.length;
    frames.speed = 0;
    frames.idx = (frames.idx - 1 + framesLength) % framesLength;
  }

  stop(): void {
    this.graph.config.frames.speed = 0;
  }

  play(): void {
    this.graph.config.frames.speed = 1;
  }

  step(): void {
    const frames: any = this.graph.config.frames;
    const framesLength: number = this.graph.frames.length;
    frames.speed = 0;
    frames.idx = (frames.idx + 1) % framesLength;
  }

  reset(): void {
    this.graph.config.frames.windowSize = 10;
  }

}
