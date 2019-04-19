import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AppConfigService } from '../../config/app-config/app-config.service';
import { ChartService } from '../../chart/chart.service';
import { ControllerConfigService } from '../../config/controller-config/controller-config.service';
import { ControllerService } from '../../controller/controller.service';
import { DataService } from '../../services/data/data.service';
import { NavigationService } from '../../navigation/navigation.service';
import { NetworkProtocolService } from '../network-protocol/network-protocol.service';
import { NetworkService } from '../network.service';
import { NetworkSimulationService } from './network-simulation.service';
import { SketchService } from '../../sketch/sketch.service';


@Component({
  selector: 'app-network-simulation',
  templateUrl: './network-simulation.component.html',
  styleUrls: ['./network-simulation.component.css']
})
export class NetworkSimulationComponent implements OnInit, OnDestroy {
  @ViewChild('content') content: any;
  public buttonDisplay: string = '0.2';
  public height: number = 0;
  public width: number = 0;
  private subscription: any;

  constructor(
    private _appConfigService: AppConfigService,
    private _chartService: ChartService,
    private _navigationService: NavigationService,
    private _networkProtocolService: NetworkProtocolService,
    private _networkService: NetworkService,
    private _networkSimulationService: NetworkSimulationService,
    private _sketchService: SketchService,
    private route: ActivatedRoute,
    public _controllerConfigService: ControllerConfigService,
    public _controllerService: ControllerService,
    public _dataService: DataService,
  ) {
  }

  ngOnInit() {
    this.resize()

    if (this._dataService.options.ready) {
      setTimeout(() => {
        this._networkSimulationService.run()
      }, 100)
    } else {
      let paramMap = this.route.snapshot.paramMap;
      let id = paramMap.get('id');
      if (id) {
        this._networkService.load(id).then(() => {
          this._sketchService.update.emit()
          this._networkSimulationService.run()
        })
      }
    }
    this.subscription = this._networkSimulationService.resize.subscribe(() => this.resize());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  resize() {
    // console.log('resize')
    this.height = this.content.elementRef.nativeElement.clientHeight;
    this.width = this.content.elementRef.nativeElement.clientWidth;
    setTimeout(() => this._chartService.rescale.emit(), 1)
  }

  toggleControllerOpened() {
    this.buttonDisplay = '0.2';
    this._controllerService.options.sidenavOpened = !this._controllerService.options.sidenavOpened;
  }

  isControllerOpened() {
    return this._controllerService.options.sidenavOpened;
  }

}
