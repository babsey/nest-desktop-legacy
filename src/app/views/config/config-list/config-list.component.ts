import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { enterAnimation } from '../../../animations/enter-animation';

import { AppConfigService } from '../../../services/app/app-config.service';
import { ModelConfigService } from '../../../services/model/model-config.service';
import { SimulationConfigService } from '../../../services/simulation/simulation-config.service';
import { ActivityGraphConfigService } from '../../../services/activity/activity-graph-config.service';


@Component({
  selector: 'app-config-list',
  templateUrl: './config-list.component.html',
  styleUrls: ['./config-list.component.scss'],
  animations: [ enterAnimation ]
})
export class ConfigListComponent implements OnInit {
  @Output() configClick: EventEmitter<any> = new EventEmitter();

  constructor(
    private _appConfigService: AppConfigService,
    private _simulationConfigService: SimulationConfigService,
    private _activityGraphConfigService: ActivityGraphConfigService,
    private router: Router,
  ) { }

  ngOnInit(
  ) {
  }

  navigate(path: string): void {
    this.router.navigate([{outlets: {primary: 'setting/' + path, nav: 'setting'}}]);
    this.configClick.emit()
  }

  isActive(path: string): boolean {
    return this.router.url.includes('/setting/' + path)
  }

  reset(): void {
    this._appConfigService.reset()
    this._simulationConfigService.reset()
    this._activityGraphConfigService.reset()
  }

  download(): void {
  }

  upload(): void {
  }

}
