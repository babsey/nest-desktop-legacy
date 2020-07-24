import { Injectable, EventEmitter } from '@angular/core';

import { Activity } from '../components/activity';


@Injectable({
  providedIn: 'root'
})
export class VisualizationService {
  public mode: string;
  public hasPositions: boolean = false;
  public init: EventEmitter<any> = new EventEmitter();
  public update: EventEmitter<any> = new EventEmitter();
  public time: number = 1000;

  constructor() { }

  checkPositions(activities: Activity[]): void {
    // console.log(activities)
    if (activities.length > 0) {
      const activitiesWithPositions: Activity[] = activities.filter(activity => activity.nodePositions.length > 0);
      this.hasPositions = activitiesWithPositions.length > 0;
    } else {
      this.hasPositions = false;
    }
    if (this.mode == undefined) {
      this.mode = this.hasPositions ? 'animation' : 'chart';
    } else if (!this.hasPositions) {
      this.mode = 'chart';
    }
  }
}
