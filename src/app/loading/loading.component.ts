import { Component, OnInit, Output, EventEmitter, DoCheck } from '@angular/core';

import { AppConfigService } from '../config/app-config/app-config.service';
import { ChartConfigService } from '../config/chart-config/chart-config.service';
import { DBConfigService } from '../config/db-config/db-config.service';
import { ModelService } from '../model/model.service';
import { ControllerConfigService } from '../config/controller-config/controller-config.service';
import { NetworkProtocolService } from '../network/network-protocol/network-protocol.service';
import { NetworkService } from '../network/network.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  @Output() ready = new EventEmitter();
  @Output() buttonClick = new EventEmitter();

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
    var autoStart = Number(this._appConfigService.config.app.autoStart);
    var hideLoading = Number(!this._appConfigService.config.app.showLoading);
    var ready = autoStart || (autoStart ^ hideLoading);
    if (this.isReady()) {
      setTimeout(() => this.ready.emit(ready), 100)
    }
  }

  isReady() {
    return (
      this._dbConfigService.ready &&
      this._appConfigService.ready &&
      this._controllerConfigService.ready &&
      this._chartConfigService.ready &&
      this._modelService.ready &&
      this._networkService.ready &&
      this._networkProtocolService.ready &&
      this._appConfigService.options.NEST.running
    )
  }

}
