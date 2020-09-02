import { Injectable, EventEmitter } from '@angular/core';

import { ActivityChartGraph } from '../../components/activity/Plotly/activityChartGraph';


@Injectable({
  providedIn: 'root'
})
export class ActivityChartService {
  public init: EventEmitter<any> = new EventEmitter();
  public update: EventEmitter<any> = new EventEmitter();
  public graph: ActivityChartGraph;

  constructor() {
  }

}
