import { Component, OnInit, Output, EventEmitter, DoCheck } from '@angular/core';

import { AppConfigService } from '../config/app-config/app-config.service';
import { ChartConfigService } from '../config/chart-config/chart-config.service';
import { DBConfigService } from '../config/db-config/db-config.service';
import { ModelService } from '../model/model.service';
import { ControllerConfigService } from '../config/controller-config/controller-config.service';
import { NetworkProtocolService } from '../network/network-protocol/network-protocol.service';
import { NetworkService } from '../network/network.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  @Output() ready = new EventEmitter();
  @Output() buttonClick = new EventEmitter();
  public version = environment.VERSION;

  constructor(
    public _appConfigService: AppConfigService,
    public _chartConfigService: ChartConfigService,
    public _dbConfigService: DBConfigService,
    public _modelService: ModelService,
    public _controllerConfigService: ControllerConfigService,
    public _networkProtocolService: NetworkProtocolService,
    public _networkService: NetworkService,
  ) { }

  ngOnInit() {
    this._dbConfigService.init()
    this._appConfigService.init()
    this._controllerConfigService.init()
    this._modelService.init()
    this._chartConfigService.init()
    this._networkService.init()
    this._networkProtocolService.init()
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
      this._controllerConfigService.status.ready &&
      this._chartConfigService.status.ready &&
      this._modelService.status.ready &&
      this._networkService.status.ready &&
      this._networkProtocolService.status.ready
    )
  }

  isLoading() {
    return (
      this._dbConfigService.status.loading &&
      this._appConfigService.status.loading &&
      this._controllerConfigService.status.loading &&
      this._chartConfigService.status.loading &&
      this._modelService.status.loading &&
      this._networkService.status.loading &&
      this._networkProtocolService.status.loading
    )
  }

  isSimulatorReady() {
    return this._appConfigService.status.NEST.response && this._appConfigService.status.NEST.simulator.ready
  }

  resetConfigs() {
    this._dbConfigService.reset()
    this._appConfigService.reset()
    this._controllerConfigService.reset()
    this._chartConfigService.reset()
  }

  resetDatabases() {
    this._modelService.reset()
    this._networkService.reset()
    this._networkProtocolService.reset()
  }

}
