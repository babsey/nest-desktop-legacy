import { Injectable, EventEmitter } from '@angular/core';

import { ActivityChartGraph } from '../../components/activity/Plotly/activityChartGraph';


@Injectable({
  providedIn: 'root'
})
export class ActivityChartService {
  private _graph: ActivityChartGraph;
  private _init: EventEmitter<any> = new EventEmitter();
  private _update: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  get init(): EventEmitter<any> {
    return this._init;
  }

  get graph(): ActivityChartGraph {
    return this._graph;
  }

  set graph(value: ActivityChartGraph) {
    this._graph = value;
  }

  get update(): EventEmitter<any> {
    return this._update;
  }

}
