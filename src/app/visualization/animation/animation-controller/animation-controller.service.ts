import { Injectable, EventEmitter } from '@angular/core';

import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class AnimationControllerService {
  public camera: any = {
    position: {
      x: 16,
      y: 0,
      z: 0,
    },
    distance: 24,
    rotation: {
      theta: 0,
      speed: 0
    },
    control: true,
  };
  public colorMap: any = {
    min: 0,
    max: 1,
    scale: 'spectral',
  };
  private colorScales: any = {
    'spectral': d3.interpolateSpectral,
    'turbo': d3.interpolateTurbo,
    'viridis': d3.interpolateViridis,
    'inferno': d3.interpolateInferno,
    'magma': d3.interpolateMagma,
    'plasma': d3.interpolatePlasma,
    'cividis': d3.interpolateCividis,
    'warm': d3.interpolateWarm,
    'cool': d3.interpolateCool,
    'cubehelix': d3.interpolateCubehelixDefault,
  }
  public frames: any = {
    sampleRate: 1,
    speed: 1,
    idx: 0,
    rate: 30,
    windowSize: 1,
    length: 1,
  }
  public trail: any = {
    mode: 'off',
    length: 10,
    fading: false,
  }
  public dotSize: number = 10;
  public trailModes: string[] = ['off', 'growing', 'shrinking', 'temporal'];
  public source: string = 'spike';
  public sources: any[] = [];
  public update: EventEmitter<any> = new EventEmitter();

  constructor() {
    window['d3'] = d3;
  }

  backplay(): void {
    this.frames.speed = -1;
  }

  backstep(): void {
    this.frames.speed = 0;
    this.frames.idx = (this.frames.idx - 1 + this.frames.length) % this.frames.length;
    this.update.emit()
  }

  stop(): void {
    this.frames.speed = 0;
  }

  play(): void {
    this.frames.speed = 1;
  }

  step(): void {
    this.frames.speed = 0;
    this.frames.idx = (this.frames.idx + 1) % this.frames.length;
    this.update.emit()
  }

  hasAnalogData(): boolean {
    return this.source != 'spike';
  }

  reset(): void {
    this.frames.windowSize = 10;
  }

  color(value: number): string {
    var min = this.colorMap.min;
    var max = this.colorMap.max;
    var colorScale = this.colorScales[this.colorMap.scale];
    return colorScale((value - min) / (max - min))
  }

}
