import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../../app.service';
import { AppConfigService } from '../../config/app-config/app-config.service';
import { ModelConfigService } from '../../model/model-config/model-config.service';
import { ModelService } from '../../model/model.service';
import { NestServerService } from '../../nest-server/nest-server.service';
import { NestServerConfigService } from '../../nest-server/nest-server-config/nest-server-config.service';
import { NetworkConfigService } from '../../network/network-config/network-config.service';
import { SimulationConfigService } from '../../simulation/simulation-config/simulation-config.service';
import { VisualizationConfigService } from '../../visualization/visualization-config/visualization-config.service';
import { LoadingService } from '../loading.service';


import { enterAnimation } from '../../animations/enter-animation';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-loading-details',
  templateUrl: './loading-details.component.html',
  styleUrls: ['./loading-details.component.scss'],
  animations: [enterAnimation],
})
export class LoadingDetailsComponent implements OnInit {
  public version = environment.VERSION;

  constructor(
    public _appService: AppService,
    public _appConfigService: AppConfigService,
    public _modelConfigService: ModelConfigService,
    public _modelService: ModelService,
    public _nestServerConfigService: NestServerConfigService,
    public _nestServerService: NestServerService,
    public _networkConfigService: NetworkConfigService,
    public _simulationConfigService: SimulationConfigService,
    public _visualizationConfigService: VisualizationConfigService,
    public _loadingService: LoadingService,
    public router: Router,
  ) { }

  ngOnInit() {
  }

}
