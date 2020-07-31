import { Injectable, EventEmitter } from '@angular/core';

import { ActivityAnimationGraph } from '../../components/activity/Threejs/activityAnimationGraph';
import { ActivityChartGraph } from '../../components/activity/Plotly/activityChartGraph';


@Injectable({
  providedIn: 'root'
})
export class ActivityGraphService {
  public init: EventEmitter<any> = new EventEmitter();
  public update: EventEmitter<any> = new EventEmitter();
  public graph: ActivityAnimationGraph | ActivityChartGraph;

  constructor() {

  }

}
