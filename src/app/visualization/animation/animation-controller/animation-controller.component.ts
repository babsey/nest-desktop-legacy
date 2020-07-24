import { Component, OnInit } from '@angular/core';

import { AppConfigService } from '../../../config/app-config/app-config.service';
import { AnimationControllerService } from './animation-controller.service';
import { VisualizationService } from '../../visualization.service';


@Component({
  selector: 'app-animation-controller',
  templateUrl: './animation-controller.component.html',
  styleUrls: ['./animation-controller.component.scss']
})
export class AnimationControllerComponent implements OnInit {

  constructor(
    private _appConfigService: AppConfigService,
    private _visualizationService: VisualizationService,
    public _animationControllerService: AnimationControllerService,
  ) { }

  ngOnInit() {
  }

  increment(): void {
    this._animationControllerService.frames.speed = this._animationControllerService.frames.speed + 1;
  }

  decrement(): void {
    this._animationControllerService.frames.speed = this._animationControllerService.frames.speed - 1;
  }

  sampleRate(): number {
    return this._animationControllerService.frames.sampleRate;
  }

  onChange(event: any): void {
    this._visualizationService.update.emit()
  }

  onAnimationChange(event: any): void {
    if (this._animationControllerService.frames.speed == 0) {
      this._animationControllerService.update.emit()
    }
  }

  onCameraChange(): void {
    this._animationControllerService.camera.control = true;
  }

}
