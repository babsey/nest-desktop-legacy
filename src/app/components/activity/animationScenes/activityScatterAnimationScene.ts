import * as THREE from 'three';

import { ActivityAnimationGraph } from '../activityAnimationGraph';
import { ActivityAnimationScene } from './activityAnimationScene';


export class ActivityScatterAnimationScene extends ActivityAnimationScene {

  constructor(graph: ActivityAnimationGraph, containerId: string) {
    super(graph, containerId);
  }

  renderFrame(): void {
    if (this.graph.frame) {

      const scale: number = this.graph.config.dotSize;
      this.graph.frame.data.forEach((data: any, idx: number) => {
        // @ts-ignore
        const layer: THREE.Group = this.activityLayers.children[idx];
        // @ts-ignore
        const activityLayer: THREE.Group = layer.children[1];
        activityLayer.children.forEach((object: THREE.Mesh) => {
          // @ts-ignore
          object.material.opacity = 0.05;
          object.scale.set(scale, scale, scale);
          // object.position.setY(object.userData.position.y);
        });

        const trail: any = this.graph.config.trail;
        if (trail.length > 0) {
          for (let trailIdx = trail.length; trailIdx > 0; trailIdx--) {
            const frame: any = this.graph.frames[this.graph.frameIdx - trailIdx];
            if (frame) {
              const trailData: any = frame.data[idx];
              this.renderDot(activityLayer, trailData, trailIdx);
            }
          }
        }
        this.renderDot(activityLayer, data);
      });
    }
  }

  renderDot(activityLayer: THREE.Group, data: any, trailIdx: number = null): void {
    const trail: any = this.graph.config.trail;
    const dotSize: number = this.graph.config.dotSize;
    const ratio = trailIdx !== null ? trailIdx / (trail.length + 1) : 0;
    const opacity = trailIdx !== null ? (trail.fading ? 1 - ratio : 1) : 1;
    let scale: number;
    switch (trail.mode) {
      case 'growing':
        scale = (1 + ratio) * dotSize;
        break;
      case 'shrinking':
        scale = (1 - ratio) * dotSize;
        break;
      default:
        scale = dotSize;
    }

    data.senders.forEach((sender: number, senderIdx: number) => {
      // @ts-ignore
      const object: THREE.Mesh = activityLayer.children[sender];
      // @ts-ignore
      const color: string = this.graph.color(data.color[senderIdx]);
      // @ts-ignore
      object.material.color.set(color);
      // @ts-ignore
      object.material.opacity = opacity;
      object.scale.set(scale, scale, scale);
      // const pos: any = object.userData.position;
      // if (trailIdx === null) {
      //   object.position.setY(pos.y);
      // } else {
      //   object.position.setY(pos.y - ratio / 2);
      // }
    });

  }

}
