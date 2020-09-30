import { Injectable, EventEmitter } from '@angular/core';

import { ActivityGraphPanel } from '../../components/activity/plotPanels/activityGraphPanel';


@Injectable({
  providedIn: 'root'
})
export class ActivityChartService {
  private _init: EventEmitter<any> = new EventEmitter();
  private _selectedPanel: ActivityGraphPanel;
  private _update: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  get init(): EventEmitter<any> {
    return this._init;
  }

  get selectedPanel(): ActivityGraphPanel {
    return this._selectedPanel;
  }

  set selectedPanel(value: ActivityGraphPanel) {
    this._selectedPanel = value;
  }

  get update(): EventEmitter<any> {
    return this._update;
  }

}
