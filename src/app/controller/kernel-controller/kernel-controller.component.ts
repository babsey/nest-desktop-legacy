import { Component, OnInit } from '@angular/core';

import { DataService } from '../../services/data/data.service';
import { ConfigService } from '../../config/config.service';
import { SimulationService } from '../../simulation/simulation.service';


@Component({
  selector: 'app-kernel-controller',
  templateUrl: './kernel-controller.component.html',
  styleUrls: ['./kernel-controller.component.css']
})
export class KernelControllerComponent implements OnInit {
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
    if (typeof(value) != 'number') return
    this._dataService.data.kernel[id] = value;
    this._simulationService.run()
  }

}
