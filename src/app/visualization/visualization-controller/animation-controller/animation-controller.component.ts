import { Component, OnInit } from '@angular/core';

import { AnimationControllerService } from './animation-controller.service';


@Component({
  selector: 'app-animation-controller',
  templateUrl: './animation-controller.component.html',
  styleUrls: ['./animation-controller.component.scss']
})
export class AnimationControllerComponent implements OnInit {

  constructor(
    public _animationControllerService: AnimationControllerService,
  ) { }

  ngOnInit() {
  }

  onChange() {
    this._animationControllerService.update.emit()
  }

  onCameraChange() {
    this._animationControllerService.camera.control = true;
    this._animationControllerService.update.emit()
  }

}
