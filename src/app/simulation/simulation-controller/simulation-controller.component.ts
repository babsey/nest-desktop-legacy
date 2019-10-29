import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { SimulationProtocolService } from '../services/simulation-protocol.service';
import { SimulationRunService } from '../services/simulation-run.service';
import { VisualizationService } from '../../visualization/visualization.service';

import { Data } from '../../classes/data';
import { Record } from '../../classes/record';

@Component({
  selector: 'app-controller',
  templateUrl: './simulation-controller.component.html',
  styleUrls: ['./simulation-controller.component.scss'],
})
export class ControllerComponent implements OnInit {
  @Input() data: Data;
  @Input() records: Record[];
  @Input() mode: string = 'network';
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  @Output() appChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private _simulationProtocolService: SimulationProtocolService,
    public _simulationRunService: SimulationRunService,
    public _visualizationService: VisualizationService,
  ) { }

  ngOnInit() {
  }

  onDataChange(data: Data): void {
    // console.log('Simulation controller on data change')
    this.dataChange.emit(this.data)
  }

  onAppChange(app: any): void {
    // this.data.app = data.app;
    this.appChange.emit(this.data);
  }

}
