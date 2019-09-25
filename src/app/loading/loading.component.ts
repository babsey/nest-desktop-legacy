import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';

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
  @Input() ready: boolean = false;
  @Output() readyChange: EventEmitter<any> = new EventEmitter();
  @Output() buttonClick: EventEmitter<any> = new EventEmitter();
  public version = environment.VERSION;
  public dbInit: boolean = false;

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
    this._dbConfigService.init(this.version)
    this._appConfigService.init(this.version)
    this._networkConfigService.init(this.version)
    this._simulationConfigService.init(this.version)
    this._visualizationConfigService.init(this.version)
  }

  ngDoCheck() {
    if (this.isConfigReady() && !this.dbInit) {
      this.dbInit = true;
      this._modelService.init()
      this._simulationService.init()
      this._simulationProtocolService.init()
      this._nestServerService.check(this._appConfigService.urlRoot())
    }

    if (this.isReady()) {
      var autoStart = this._appConfigService.config.app.loading ? this._appConfigService.config.app.autoStart : true;
      setTimeout(() => this.readyChange.emit(autoStart), 100)
    }
  }

  isConfigReady() {
    return (
      this._dbConfigService.status.ready &&
      this._appConfigService.status.ready &&
      this._networkConfigService.status.ready &&
      this._simulationConfigService.status.ready &&
      this._visualizationConfigService.status.ready
    )
  }

  isDatabaseReady() {
    return (
      this._modelService.status.ready &&
      this._simulationService.status.ready &&
      this._simulationProtocolService.status.ready
    )
  }

  isReady() {
    return this.isConfigReady() && this.isDatabaseReady()
  }

  isSimulatorReady() {
    return this._nestServerService.status.response && this._nestServerService.status.simulator.ready;
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
