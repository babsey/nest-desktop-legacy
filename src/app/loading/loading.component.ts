import { Component, OnInit, Output, EventEmitter, DoCheck } from '@angular/core';

import { AppConfigService } from '../config/app-config/app-config.service';
import { DBConfigService } from '../config/db-config/db-config.service';
import { ModelService } from '../model/model.service';
import { NestServerService } from '../services/nest-server/nest-server.service';
import { NetworkConfigService } from '../network/network-config/network-config.service';
import { SimulationConfigService } from '../simulation/simulation-config/simulation-config.service';
import { SimulationProtocolService } from '../simulation/services/simulation-protocol.service';
import { SimulationService } from '../simulation/services/simulation.service';
import { VisualizationConfigService } from '../visualization/visualization-config/visualization-config.service';


import { environment } from '../../environments/environment';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  @Output() ready: EventEmitter<any> = new EventEmitter();
  @Output() buttonClick: EventEmitter<any> = new EventEmitter();
  public version = environment.VERSION;

  constructor(
    public _appConfigService: AppConfigService,
    public _simulationConfigService: SimulationConfigService,
    public _dbConfigService: DBConfigService,
    public _modelService: ModelService,
    public _networkConfigService: NetworkConfigService,
    public _visualizationConfigService: VisualizationConfigService,
    public _simulationProtocolService: SimulationProtocolService,
    public _simulationService: SimulationService,
    public _nestServerService: NestServerService,
  ) { }

  ngOnInit() {
    this._dbConfigService.init()
    this._appConfigService.init()
    this._networkConfigService.init()
    this._simulationConfigService.init()
    this._modelService.init()
    this._visualizationConfigService.init()
    this._simulationService.init()
    this._simulationProtocolService.init()
    this._nestServerService.check(this._appConfigService.urlRoot())
  }

  ngDoCheck() {
    if (!this._appConfigService.config.app.showLoading) {
      this._appConfigService.config.app.showLoading = !this.isSimulatorReady()
    }
    var autoStart = Number(this._appConfigService.config.app.autoStart);
    var hideLoading = Number(!this._appConfigService.config.app.showLoading);
    var ready = autoStart || (autoStart ^ hideLoading);
    if (this.isReady()) {
      setTimeout(() => this.ready.emit(ready), 100)
    }
  }

  isReady() {
    return (
      this._dbConfigService.status.ready &&
      this._appConfigService.status.ready &&
      this._networkConfigService.status.ready &&
      this._simulationConfigService.status.ready &&
      this._visualizationConfigService.status.ready &&
      this._modelService.status.ready &&
      this._simulationService.status.ready &&
      this._simulationProtocolService.status.ready
    )
  }

  isLoading() {
    return (
      this._dbConfigService.status.loading &&
      this._appConfigService.status.loading &&
      this._networkConfigService.status.loading &&
      this._simulationConfigService.status.loading &&
      this._visualizationConfigService.status.loading &&
      this._modelService.status.loading &&
      this._simulationService.status.loading &&
      this._simulationProtocolService.status.loading
    )
  }

  isSimulatorReady() {
    return this._nestServerService.status.response && this._nestServerService.status.simulator.ready
  }

  resetConfigs() {
    this._dbConfigService.reset()
    this._appConfigService.reset()
    this._networkConfigService.reset()
    this._simulationConfigService.reset()
    this._visualizationConfigService.reset()
  }

  resetDatabases() {
    this._modelService.reset()
    this._simulationService.reset()
    this._simulationProtocolService.reset()
  }

}
