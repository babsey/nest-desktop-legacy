import { Injectable, EventEmitter } from '@angular/core';

import { ActivityAnimationGraph } from '../../components/activity/activityAnimationGraph';
import { ActivityAnimationScene } from '../../components/activity/animationScenes/activityAnimationScene';
import { ActivityAnimationSceneBox } from '../../components/activity/animationScenes/activityAnimationSceneBox';
import { ActivityAnimationSceneBoxHistogram } from '../../components/activity/animationScenes/activityAnimationSceneBoxHistogram';
import { ActivityAnimationSceneSphere } from '../../components/activity/animationScenes/activityAnimationSceneSphere';

@Injectable({
  providedIn: 'root'
})
export class ActivityAnimationService {
  private _update: EventEmitter<any> = new EventEmitter();
  private _scenes: any[];
  private _selectedSceneIdx = 0;
  private _scene: ActivityAnimationScene;

  constructor() {
    this._scenes = [{
      value: 0,
      label: 'sphere',
      scene: (graph: ActivityAnimationGraph) =>
        new ActivityAnimationSceneSphere(graph, 'activityAnimationScene'),
    }, {
      value: 1,
      label: 'box',
      scene: (graph: ActivityAnimationGraph) =>
        new ActivityAnimationSceneBox(graph, 'activityAnimationScene'),
    }, {
      value: 2,
      label: 'box histogram',
      scene: (graph: ActivityAnimationGraph) =>
        new ActivityAnimationSceneBoxHistogram(
          graph,
          'activityAnimationScene'
        ),
    }];
  }

  get scene(): ActivityAnimationScene {
    return this._scene;
  }

  get scenes(): any {
    return this._scenes;
  }

  get selectedSceneIdx(): number {
    return this._selectedSceneIdx;
  }

  set selectedSceneIdx(value: number) {
    this._selectedSceneIdx = value;
  }

  get update(): EventEmitter<any> {
    return this._update;
  }

  loadScene(graph: ActivityAnimationGraph): void {
    // console.log('Initialize animation scene');
    this._scene = this._scenes[this._selectedSceneIdx].scene(graph);
  }

}
