import { Injectable } from '@angular/core';

import { Activity } from '../../components/activity/activity';


@Injectable({
  providedIn: 'root'
})
export class ActivityStatsService {
  private _selectedActivity: Activity;

  constructor() {
  }

  get selectedActivity(): Activity {
    return this._selectedActivity;
  }

  set selectedActivity(activity: Activity) {
    this._selectedActivity = activity;
  }

  reset(): void {
    this._selectedActivity = undefined;
  }

}
