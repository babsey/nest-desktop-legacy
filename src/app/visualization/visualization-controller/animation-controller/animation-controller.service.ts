import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationControllerService {
  public animation: boolean = false;
  public camera: any = {
    position: {
      x: 20,
      y: 0,
      z: 0,
    },
    distance: 20,
    rotation: {
      theta: 0,
      speed: 0
    },
    control: true,
  };
  public frames = {
    idx: 0,
    rate: 30,
    windowSize: 10,
    length: 1,
  }
  public trail = {
    mode: 'off',
    length: 0,
    fading: false,
  }
  public dotSize: number = 3;
  public trailModes: string[] = ['off', 'growing', 'shrinking', 'temporal'];
  public update: EventEmitter<any> = new EventEmitter();

  constructor() { }

  init() {
    // this.animation = false;
    // this.frames.idx = 0;
  }
}
