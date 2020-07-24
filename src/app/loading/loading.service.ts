import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../app.service';
import { AppConfigService } from '../config/app-config/app-config.service';
import { ModelConfigService } from '../model/model-config/model-config.service';
import { ModelService } from '../model/model.service';
import { NestServerService } from '../nest-server/nest-server.service';
import { NestServerConfigService } from '../nest-server/nest-server-config/nest-server-config.service';
import { NetworkConfigService } from '../network/network-config/network-config.service';
import { SimulationConfigService } from '../simulation/simulation-config/simulation-config.service';
import { VisualizationConfigService } from '../visualization/visualization-config/visualization-config.service';


@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public ready: boolean = false;
  public loaded: any = {
    database: false,
    config: false,
  }

  constructor(
    private _appService: AppService,
    public _appConfigService: AppConfigService,
    public _modelConfigService: ModelConfigService,
    public _modelService: ModelService,
    public _nestServerConfigService: NestServerConfigService,
    public _nestServerService: NestServerService,
    public _networkConfigService: NetworkConfigService,
    public _simulationConfigService: SimulationConfigService,
    public _visualizationConfigService: VisualizationConfigService,
    public router: Router,
  ) { }

  init(): void {
    this.initConfig()
    const checkingConfigLoaded = setInterval(() => {
      if (this.isConfigReady()) {
        this.checkServer()
        clearInterval(checkingConfigLoaded)
      }
    }, 100)
  }

  initConfig(): void {
    if (this.loaded.config) return
    // console.log('Initialize config')
    this._nestServerConfigService.init()
    this._appConfigService.init()
    this._modelConfigService.init()
    this._networkConfigService.init()
    this._simulationConfigService.init()
    this._visualizationConfigService.init()
    this.loaded.config = true;
  }

  isConfigReady(): boolean {
    // console.log('Check config is ready')
    return (
      this._nestServerConfigService.status.ready &&
      this._appConfigService.status.ready &&
      this._modelConfigService.status.ready &&
      this._networkConfigService.status.ready &&
      this._simulationConfigService.status.ready &&
      this._visualizationConfigService.status.ready
    )
  }

  checkServer(): void {
    this._nestServerService.check()
  }

  isSimulatorReady(): boolean {
    return this._nestServerService.status.response && this._nestServerService.status.simulator.ready;
  }

  resetConfigs(): void {
    this._nestServerConfigService.reset()
    this._appConfigService.reset()
    this._modelConfigService.reset()
    this._networkConfigService.reset()
    this._simulationConfigService.reset()
    this._visualizationConfigService.reset()
  }

}
