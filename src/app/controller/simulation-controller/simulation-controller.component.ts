import { Component, OnInit } from '@angular/core';

import { DataService } from '../../services/data/data.service';
import { ConfigService } from '../../config/config.service';
import { SimulationService } from '../../simulation/simulation.service';


@Component({
  selector: 'app-simulation-controller',
  templateUrl: './simulation-controller.component.html',
  styleUrls: ['./simulation-controller.component.css']
})
export class SimulationControllerComponent implements OnInit {
  public options: any;

  constructor(
    public _dataService: DataService,
    public _configService: ConfigService,
    public _simulationService: SimulationService,
  ) {
  }

  ngOnInit() {
  }

  onChange(id, value) {
    this._simulationService.run()
  }

}
