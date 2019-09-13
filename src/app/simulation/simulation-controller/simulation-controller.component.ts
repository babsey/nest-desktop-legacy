import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { SimulationControllerService } from './simulation-controller.service';
import { SimulationProtocolService } from '../services/simulation-protocol.service';
import { SimulationRunService } from '../services/simulation-run.service';

import { Data } from '../../classes/data';

@Component({
  selector: 'app-controller',
  templateUrl: './simulation-controller.component.html',
  styleUrls: ['./simulation-controller.component.scss'],
})
export class ControllerComponent implements OnInit {
  @Input() data: Data;
  @Input() records: any[];
  @Input() mode: string = 'network';
  @Output() simulationChange: EventEmitter<any> = new EventEmitter();
  @Output() appChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private _simulationProtocolService: SimulationProtocolService,
    public _simulationControllerService: SimulationControllerService,
    public _simulationRunService: SimulationRunService,
  ) { }

  ngOnInit() {
  }

  onSimulationChange(data) {
    this.data._id = '';
    this.data.simulation = data.simulation;
    this.simulationChange.emit(this.data)
  }

  onAppChange(data) {
    // this.data.app = data.app;
    this.appChange.emit(this.data);
  }

}
