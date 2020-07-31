import { Component, OnInit } from '@angular/core';

import { SimulationConfigService } from '../../../services/simulation/simulation-config.service';


@Component({
  selector: 'app-simulation-config',
  templateUrl: './simulation-config.component.html',
  styleUrls: ['./simulation-config.component.scss']
})
export class SimulationConfigComponent implements OnInit {

  constructor(
    public _simulationConfigService: SimulationConfigService,
  ) { }

  ngOnInit() {
  }

  save(): void {
    this._simulationConfigService.save()
  }

}
