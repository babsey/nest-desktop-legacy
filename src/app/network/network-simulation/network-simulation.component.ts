import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatBottomSheet } from '@angular/material';

import { ControllerSheetComponent } from '../../controller/controller-sheet/controller-sheet.component';

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

  constructor(
    private _navigationService: NavigationService,
    private _networkProtocolService: NetworkProtocolService,
    private _networkService: NetworkService,
    private route: ActivatedRoute,
    public _appConfigService: AppConfigService,
    public _chartService: ChartService,
    public _controllerConfigService: ControllerConfigService,
    public _controllerService: ControllerService,
    public _dataService: DataService,
    public _simulationService: NetworkSimulationService,
    public _sketchService: SketchService,
    public bottomSheet: MatBottomSheet,
  ) {
  }

  ngOnInit() {
    this.resize()
    if (this._controllerConfigService.config.bottomSheetOpened) {
      setTimeout(() => this.openBottomSheet(), 1)
    }

    if (this._dataService.options.ready) {
      setTimeout(() => {
        this._simulationService.run()
      }, 100)
    } else {
      let paramMap = this.route.snapshot.paramMap;
      let id = paramMap.get('id');
      if (id) {
        this._networkService.load(id).then(() => {
          this._sketchService.update.emit()
          this._simulationService.run()
        })
      }
    }
  }

  ngOnDestroy() {
    this.bottomSheet.dismiss()
  }

  resize() {
    // console.log('resize')
    var height = this.content.elementRef.nativeElement.clientHeight;
    var width = this.content.elementRef.nativeElement.clientWidth;
    this._chartService.resize(width, height)
  }

  onChange() {
    this.resize()
  }

  toggleControllerOpened() {
    this.buttonDisplay = '0.2';
    this._controllerService.options.sidenavOpened = !this._controllerService.options.sidenavOpened;
  }

  isControllerOpened() {
    return this._controllerService.options.sidenavOpened;
  }

  isBottomSheetOpened() {
    return this.bottomSheet._openedBottomSheetRef != null;
  }

  openBottomSheet() {
    this.bottomSheet.open(ControllerSheetComponent, {
      autoFocus: false,
      hasBackdrop: false,
      disableClose: true,
    });
    this._controllerService.openBottomSheet()
  }

  showSlider(mode = true) {
    this._controllerConfigService.config.showSlider = mode;
    this._controllerConfigService.save()
  }

  clearDisplay() {
    this._dataService.data.collections.map(collection => {
      delete collection['display']
    })
    this._dataService.data.connectomes.map(connectome => {
      delete connectome['display']
    })
  }

  setLevel(event) {
    this._controllerConfigService.config.level = event.option.selected ? parseInt(event.option.value) : -1;
    this._controllerConfigService.save()
  }

  getLevel() {
    let level = this._controllerConfigService.config.level;
    return level;
  }

  isLevel(level) {
    return this._controllerConfigService.config.level == level;
  }

}
