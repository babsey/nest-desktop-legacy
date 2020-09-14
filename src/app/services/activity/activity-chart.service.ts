import { Injectable, EventEmitter } from '@angular/core';

import { ActivityChartGraph } from '../../components/activity/activityChartGraph';
import { ActivityGraphPanel } from '../../components/activity/plotPanels/activityGraphPanel';


@Injectable({
  providedIn: 'root'
})
export class ActivityChartService {
  private _init: EventEmitter<any> = new EventEmitter();
  private _update: EventEmitter<any> = new EventEmitter();
  private _selectedPanel: ActivityGraphPanel;

  constructor() {
  }

  get init(): EventEmitter<any> {
    return this._init;
  }

  get update(): EventEmitter<any> {
    return this._update;
  }

  get selectedPanel(): ActivityGraphPanel {
    return this._selectedPanel;
  }

  set selectedPanel(value: ActivityGraphPanel) {
    this._selectedPanel = value;
  }

}
