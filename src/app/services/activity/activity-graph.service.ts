import { Injectable } from '@angular/core';

import { Project } from '../../components/project/project';


import { ActivityAnimationService } from './activity-animation.service';
import { ActivityChartService } from './activity-chart.service';


@Injectable({
  providedIn: 'root'
})
export class ActivityGraphService {
  private _mode: string = 'chart';

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

  init(project: Project): void {
    if (this.mode === 'chart') {
      this._activityChartService.init.emit(project);
    } else if (this.mode === 'animation') {
      this._activityAnimationService.init.emit(project);
    }
  }

  update(): void {
    if (this.mode === 'chart') {
      this._activityChartService.update.emit();
    } else if (this.mode === 'animation') {
      this._activityAnimationService.update.emit();
    }
  }

  isGraphLoaded(): boolean {
    if (this.mode === 'chart') {
      return this._activityChartService.graph !== undefined;
    } else {
      return this._activityAnimationService.graph !== undefined;
    }
  }

}
