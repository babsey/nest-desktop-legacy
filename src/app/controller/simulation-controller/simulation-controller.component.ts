import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { DataService } from '../../services/data/data.service';
import { ControllerConfigService } from '../../config/controller-config/controller-config.service';
import { NetworkSimulationService } from '../../network/network-simulation/network-simulation.service';



@Component({
  selector: 'app-simulation-controller',
  templateUrl: './simulation-controller.component.html',
  styleUrls: ['./simulation-controller.component.css']
})
export class SimulationControllerComponent implements OnInit {
  public options: any;
  @Output() simulationChange = new EventEmitter();

  constructor(
    private _controllerConfigService: ControllerConfigService,
    public _dataService: DataService,
    public _networkSimulationService: NetworkSimulationService,
  ) {
  }

  ngOnInit() {
  }

  params() {
    return this._controllerConfigService.config.simulation.params;
  }

  onChange() {
    this.simulationChange.emit()
  }

  onSelectionChange(event) {
    this._networkSimulationService.config[event.option.value] = event.option.selected;
    this._networkSimulationService.saveConfig()
  }

}
