import * as THREE from 'three';

import { Activity } from '../activity';

import { ActivityAnimationGraph } from '../activityAnimationGraph';
import { ActivityAnimationScene } from './activityAnimationScene';


export class ActivityAnimationSceneBox extends ActivityAnimationScene {

  constructor(graph: ActivityAnimationGraph, containerId: string) {
    super('box', graph, containerId);
  }

  createLayer(activity: Activity): THREE.Group {
    // console.log('Create activity layer');
    const size = 0.01;
    const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(size, size, size);
    const layer: THREE.Group = new THREE.Group();
    const scale = 0.01;
    const activityLayer: THREE.Group = new THREE.Group();
    const color: string = activity.recorder.view.color;
    activityLayer.userData.color = color;
    activity.nodePositions.forEach((pos: number[]) => {
      const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
      });
      const object: THREE.Mesh = new THREE.Mesh(
        geometry,
        material
      );
      object.userData.color = color;

      const position: any = {
        x: pos[0],
        y: pos.length === 3 ? pos[1] : 0,
        z: pos.length === 3 ? pos[2] : pos[1],
      };
      object.userData.position = position;
      object.position.set(position.x, position.y, position.z);
      object.scale.set(scale, scale, scale);
      // object.layers.set(activity.idx + 1);
      activityLayer.add(object);
    });
    layer.add(this.grids(activity.nodePositions[0].length));
    layer.add(activityLayer);
    return layer;
  }

  renderFrame(): void {
    if (this.graph.frame) {
      const scale: number = this.graph.config.objectSize;
      this.graph.frame.data.forEach((data: any, idx: number) => {
        // @ts-ignore
        const layer: THREE.Group = this.activityLayers.children[idx];
        // @ts-ignore
        const activityLayer: THREE.Group = layer.children[1];
        activityLayer.children.forEach((object: THREE.Mesh) => {
          // @ts-ignore
          object.material.opacity = 0;
          object.scale.set(scale, scale, scale);
          // object.position.setY(object.userData.position.y);
        });

        const trail: any = this.graph.config.trail;
        if (trail.length > 0) {
          for (let trailIdx = trail.length; trailIdx > 0; trailIdx--) {
            const frame: any = this.graph.frames[this.graph.frameIdx - trailIdx];
            if (frame) {
              const trailData: any = frame.data[idx];
              this.updateObjects(activityLayer, trailData, trailIdx);
            }
          }
        }
        this.updateObjects(activityLayer, data);
      });
    }
  }

  updateObjects(activityLayer: THREE.Group, data: any, trailIdx: number = null): void {
    const trail: any = this.graph.config.trail;
    const size: number = this.graph.config.objectSize;
    const ratio = trailIdx !== null ? trailIdx / (trail.length + 1) : 0;
    const opacity = trailIdx !== null ? (trail.fading ? 1 - ratio : 1) : this.graph.config.opacity;
    let scale: number;
    switch (trail.mode) {
      case 'growing':
        scale = (1 + ratio) * size;
        break;
      case 'shrinking':
        scale = (1 - ratio) * size;
        break;
      default:
        scale = size;
    }

    data.senders.forEach((sender: number, senderIdx: number) => {
      // @ts-ignore
      const object: THREE.Mesh = activityLayer.children[sender];
      let value: number;
      if (data.hasOwnProperty(this.graph.recordFrom)) {
        value = this.graph.ratio(data[this.graph.recordFrom][senderIdx]);
      }
      const color: string = value !== undefined ? this.graph.color(value) : object.userData.color;
      // @ts-ignore
      object.material.color.set(color);
      // @ts-ignore
      object.material.opacity = opacity;
      object.scale.set(scale, (value !== undefined ? 0.5 : scale), scale);
      if (value !== undefined && !this.graph.config.flatHeight) {
        const height: number = value * size;
        if (!this.graph.config.flyingBoxes) {
          object.scale.setY(height);
        }
        object.position.setY(object.userData.position.y + (height / 200));
      } else {
        object.position.setY(object.userData.position.y);
      }
      // const pos: any = object.userData.position;
      // if (trailIdx === null) {
      //   object.position.setY(pos.y);
      // } else {
      //   object.position.setY(pos.y - ratio / 2);
      // }
    });

  }

}
