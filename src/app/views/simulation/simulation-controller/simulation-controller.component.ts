import { Component, OnInit, Input } from '@angular/core';

import { Simulation } from '../../../components/simulation/simulation';


@Component({
  selector: 'app-simulation-controller',
  templateUrl: './simulation-controller.component.html',
  styleUrls: ['./simulation-controller.component.scss']
})
export class SimulationControllerComponent implements OnInit {
  @Input() simulation: Simulation;
  public params: any[];

  constructor(
  ) { }

  ngOnInit() {
    this.params = this.simulation.config.params || [];
  }

  onChange(value: any, id: string): void {
    if (id === 'randomSeed') {
      this.simulation.config = {'autoRandomSeed': false};
    }
  }

  onSelectionChange(event: any): void {
    const config: any = {};
    config[event.option.value] = event.option.selected;
    if (event.option.value === 'autoRandomSeed') {
      this.simulation.config = config;
    } else {
      this.simulation.project.config = config;
    }
  }

}
