import { Component, OnInit } from '@angular/core';

import { Config } from '../../../components/config';


@Component({
  selector: 'app-activity-graph-config',
  templateUrl: './activity-graph-config.component.html',
  styleUrls: ['./activity-graph-config.component.scss']
})
export class ActivityGraphConfigComponent implements OnInit {
  private _config: Config;

  constructor() {
    this._config = new Config('ActivityChartGraph');
  }

  ngOnInit() {
  }

  get config(): any {
    return this._config.data;
  }

}
