import { Injectable, EventEmitter } from '@angular/core';

import { ActivityAnimationGraph } from '../../components/activity/Threejs/activityAnimationGraph';


@Injectable({
  providedIn: 'root'
})
export class ActivityAnimationService {
  public init: EventEmitter<any> = new EventEmitter();
  public update: EventEmitter<any> = new EventEmitter();
  public graph: ActivityAnimationGraph;

  constructor() {
  }

}
