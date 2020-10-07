import { Injectable, EventEmitter } from '@angular/core';

import { ActivityAnimationGraph } from '../../components/activity/activityAnimationGraph';


@Injectable({
  providedIn: 'root'
})
export class ActivityAnimationService {
  private _graph: ActivityAnimationGraph;
  private _init: EventEmitter<any> = new EventEmitter();
  private _update: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  get init(): EventEmitter<any> {
    return this._init;
  }

  get graph(): ActivityAnimationGraph {
    return this._graph;
  }

  set graph(value: ActivityAnimationGraph) {
    this._graph = value;
  }

  get update(): EventEmitter<any> {
    return this._update;
  }

}
