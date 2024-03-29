import { Component, OnInit, Input } from '@angular/core';

import { Simulation } from '../../../components/simulation/simulation';


@Component({
  selector: 'app-simulation-controller',
  templateUrl: './simulation-controller.component.html',
  styleUrls: ['./simulation-controller.component.scss']
})
export class SimulationControllerComponent implements OnInit {
  @Input() simulation: Simulation;
  private _params: any[];

  constructor() {
  }

  ngOnInit() {
    this._params = this.simulation.config.params || [];
  }

  get params(): any[] {
    return this._params;
  }

  onChange(value: any, id: string): void {
    if (id === 'randomSeed') {
      this.simulation.updateConfig({ autoRandomSeed: false });
    }
  }

  onSelectionChange(event: any): void {
    const config: any = {};
    config[event.option.value] = event.option.selected;
    if (event.option.value === 'autoRandomSeed') {
      this.simulation.updateConfig(config);
    } else {
      this.simulation.project.config.updateConfig(config);
    }
  }

}
