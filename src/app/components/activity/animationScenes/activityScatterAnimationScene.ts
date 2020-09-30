import * as THREE from 'three';

import { ActivityAnimationGraph } from '../activityAnimationGraph';
import { ActivityAnimationScene } from './activityAnimationScene';


export class ActivityScatterAnimationScene extends ActivityAnimationScene {

  constructor(graph: ActivityAnimationGraph, containerId: string) {
    super(graph, containerId);
  }

  frameUpdate(frames: any[]): void {
    if (frames.length === 0) { return; }

    this.scene.children
      .slice(2)
      .map((object: any) => this.scene.remove(object));

    const configFrames: any = this.graph.config.frames;
    const nSamples: number = this.graph.endtime * configFrames.sampleRate;
    let frame: any;
    this.graph.frameIdx = (this.graph.frameIdx + nSamples) % nSamples;
    for (let frameIdx = 0; frameIdx < configFrames.windowSize; frameIdx++) {
      frame = frames[frameIdx];
      if (frame) {
        frame.data.forEach((d: any) => this.dataUpdate(d));
      }
    }

    let ratio: number;
    let scale: number;
    let opacity: number;
    const trail: any = this.graph.config.trail;
    for (let trailIdx = 0; trailIdx < trail.length; trailIdx++) {
      frame = frames[this.graph.frameIdx - trailIdx];
      if (frame) {
        ratio = trailIdx / (trail.length + 1);
        opacity = 1 - (trail.fading ? ratio : 0);
        switch (trail.mode) {
          case 'growing':
            scale = 1 + ratio;
            break;
          case 'shrinking':
            scale = 1 - ratio;
            break;
          default:
            scale = 1;
        }
        frame.data.forEach((d: any) =>
          this.dataUpdate(d, {
            opacity,
            scale,
          })
        );
      }
    }
  }

  dataUpdate(data: any, config: any = {}): void {
    if (data === undefined) { return; }

    const extent: number[][] = this.graph.layout.extent || [
      [-0.5, 0.5],
      [-0.5, 0.5],
    ];
    const ndim: number = extent.length;
    const opacity: number = config.hasOwnProperty('opacity') ? config.opacity : data.opacity || 1;
    const scale: number = this.graph.config.dotSize * (config.scale || 1);

    const configFrames: any = this.graph.config.frames;
    const trail: any = this.graph.config.trail;
    const ts: number = this.graph.frameIdx / configFrames.sampleRate;

    for (let i = 0; i < data.x.length; i++) {
      const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial(
        {
          color: this.graph.color(data.color[i]),
          transparent: true,
          opacity,
        }
      );
      const object: THREE.Mesh = new THREE.Mesh(
        this.geometry,
        material
      );
      object.position.x =
        0.5 -
        (trail.mode === 'temporal'
          ? (ts - data.x[i]) / configFrames.windowSize
          : 0);
      object.position.y = data.y[i];
      if (ndim > 2) {
        object.position.z = data.z[i];
      }
      if (scale !== 1) {
        object.scale.x = scale;
        object.scale.y = scale;
        object.scale.z = scale;
      }
      this.scene.add(object);
    }
  }

}
