import { Component, OnInit, Input } from '@angular/core';

import { AppConfigService } from '../../config/app-config/app-config.service';

import { Data } from '../../classes/data';

@Component({
  selector: 'app-simulation-details',
  templateUrl: './simulation-details.component.html',
  styleUrls: ['./simulation-details.component.scss']
})
export class SimulationDetailsComponent implements OnInit {
  @Input() data: Data;

  constructor(
    private _appConfigService: AppConfigService,
  ) { }

  ngOnInit() {
  }

  advanced() {
    return this._appConfigService.config['app'].advanced;
  }

}
