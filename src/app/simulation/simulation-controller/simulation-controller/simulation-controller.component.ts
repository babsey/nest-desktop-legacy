import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SimulationConfigService } from '../../simulation-config/simulation-config.service';
import { SimulationRunService } from '../../services/simulation-run.service';

import { Data } from '../../../classes/data';


@Component({
  selector: 'app-simulation-controller',
  templateUrl: './simulation-controller.component.html',
  styleUrls: ['./simulation-controller.component.scss']
})
export class SimulationControllerComponent implements OnInit {
  @Input() data: Data;
  @Output() simulationChange: EventEmitter<any> = new EventEmitter();
  public options: any;

  constructor(
    private _simulationConfigService: SimulationConfigService,
    public _simulationRunService: SimulationRunService,
  ) {
  }

  ngOnInit() {
  }

  params() {
    return this._simulationConfigService.config.controller.simulation.params;
  }

  onChange(id, value) {
    this.data.simulation[id] = value;
    if (id == 'random_seed') {
      this._simulationRunService.config['autoRandomSeed'] = false;
      this._simulationRunService.saveConfig()
    }
    this.simulationChange.emit(this.data)
  }

  onSelectionChange(event) {
    this._simulationRunService.config[event.option.value] = event.option.selected;
    this._simulationRunService.saveConfig()
  }

}
