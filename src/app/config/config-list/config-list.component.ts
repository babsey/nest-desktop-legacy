import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { AppConfigService } from '../app-config/app-config.service';
import { ModelConfigService } from '../../model/model-config/model-config.service';
import { NavigationService } from '../../navigation/navigation.service';
import { NestServerConfigService } from '../../nest-server/nest-server-config/nest-server-config.service';
import { NetworkConfigService } from '../../network/network-config/network-config.service';
import { SimulationConfigService } from '../../simulation/simulation-config/simulation-config.service';
import { VisualizationConfigService } from '../../visualization/visualization-config/visualization-config.service';


@Component({
  selector: 'app-config-list',
  templateUrl: './config-list.component.html',
  styleUrls: ['./config-list.component.scss']
})
export class ConfigListComponent implements OnInit {
  @Output() configClick: EventEmitter<any> = new EventEmitter();

  constructor(
    private _appConfigService: AppConfigService,
    private _modelConfigService: ModelConfigService,
    private _nestServerConfigService: NestServerConfigService,
    private _networkConfigService: NetworkConfigService,
    private _simulationConfigService: SimulationConfigService,
    private _visualizationConfigService: VisualizationConfigService,
    private router: Router,
    public _navigationService: NavigationService,
  ) { }

  ngOnInit(
  ) {
  }

  navigate(path: string): void {
    this.router.navigate([{outlets: {primary: 'config/' + path, nav: 'config'}}]);
    this.configClick.emit()
  }

  isActive(path: string): boolean {
    return this.router.url.includes('/config/' + path)
  }

  reset(): void {
    this._nestServerConfigService.reset()
    this._appConfigService.reset()
    this._modelConfigService.reset()
    this._networkConfigService.reset()
    this._simulationConfigService.reset()
    this._visualizationConfigService.reset()
  }

  download(): void {
  }

  upload(): void {
  }

}
