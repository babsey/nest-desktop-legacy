import { Component, Input, OnInit } from '@angular/core';


import { AppConfigService } from '../config/app-config/app-config.service';
import { ControllerConfigService } from '../config/controller-config/controller-config.service';
import { ControllerService } from './controller.service';
import { DataService } from '../services/data/data.service';
import { NetworkSimulationService } from '../network/network-simulation/network-simulation.service';
import { SketchService } from '../sketch/sketch.service';


@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.css'],
})
export class ControllerComponent implements OnInit {

  constructor(
    private _appConfigService: AppConfigService,
    private _controllerConfigService: ControllerConfigService,
    private _networkSimulationService: NetworkSimulationService,
    private _sketchService: SketchService,
    public _controllerService: ControllerService,
    public _dataService: DataService,
  ) { }

  ngOnInit() {
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

  toggleType(element_type) {
    this._sketchService.selected.node = null;
    this._sketchService.update.emit()
    this._controllerService.selected = this._controllerService.selected == element_type ? null : element_type;
  }

  isSelected(element_type) {
    return this._controllerService.selected == null || this._controllerService.selected == element_type;
  }

  onChange() {
    if (!this._dataService.options.edit) {
      this._networkSimulationService.run()
    }
  }

}
