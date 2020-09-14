import { Injectable } from '@angular/core';

import { Project } from '../../components/project/project';


import { ActivityAnimationService } from './activity-animation.service';
import { ActivityChartService } from './activity-chart.service';


@Injectable({
  providedIn: 'root'
})
export class ActivityGraphService {
  private _mode = 'chart';

  constructor(
    private _activityAnimationService: ActivityAnimationService,
    private _activityChartService: ActivityChartService,
  ) { }

  get mode(): string {
    return this._mode;
  }

  set mode(value: string) {
    this._mode = value;
  }

}
