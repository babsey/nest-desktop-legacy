import { Component, OnInit } from '@angular/core';

import { DataService } from '../shared/services/data/data.service';
import { ConfigService } from '../shared/services/config/config.service';


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
  ) {
  }

  ngOnInit() {
  }

}
