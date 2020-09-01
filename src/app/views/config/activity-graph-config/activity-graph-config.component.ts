import { Component, OnInit } from '@angular/core';

import { ConfigService } from '../../../components/config';


@Component({
  selector: 'app-activity-graph-config',
  templateUrl: './activity-graph-config.component.html',
  styleUrls: ['./activity-graph-config.component.scss']
})
export class ActivityGraphConfigComponent implements OnInit {
  private _config: ConfigService;

  constructor() {
    this._config = new ConfigService('ActivityChartGraph');
  }

  ngOnInit() {
  }

  get config(): any {
    return this._config.data;
  }

}
