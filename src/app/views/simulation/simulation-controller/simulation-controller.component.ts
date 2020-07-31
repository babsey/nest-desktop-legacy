import { Component, OnInit, Input } from '@angular/core';

import { Simulation } from '../../../components/simulation/simulation';

import { SimulationRunService } from '../../../services/simulation/simulation-run.service';


@Component({
  selector: 'app-simulation-controller',
  templateUrl: './simulation-controller.component.html',
  styleUrls: ['./simulation-controller.component.scss']
})
export class SimulationControllerComponent implements OnInit {
  @Input() simulation: Simulation;
  public params: any[];

  constructor(
    public _simulationRunService: SimulationRunService,
  ) {
  }

  ngOnInit() {
    this.params = this.simulation.config.data.params || [];
  }

  onChange(value: any, id: string): void {
    if (id === 'randomSeed') {
      this._simulationRunService.config['autoRandomSeed'] = false;
      this._simulationRunService.saveConfig()
    }
  }

  onSelectionChange(event: any): void {
    this._simulationRunService.config[event.option.value] = event.option.selected;
    this._simulationRunService.saveConfig()
  }

}
