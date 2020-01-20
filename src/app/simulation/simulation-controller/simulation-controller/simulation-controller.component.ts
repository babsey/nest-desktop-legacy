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
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  public options: any;

  constructor(
    private _simulationConfigService: SimulationConfigService,
    public _simulationRunService: SimulationRunService,
  ) {
  }

  ngOnInit(): void {
  }

  params(): any {
    return this._simulationConfigService.config.controller.simulation.params;
  }

  onChange(value: any, id: string): void {
    if (id == 'random_seed') {
      this._simulationRunService.config['autoRandomSeed'] = false;
      this._simulationRunService.saveConfig()
    }
    this.dataChange.emit(this.data)
  }

  onSelectionChange(event: any): void {
    this._simulationRunService.config[event.option.value] = event.option.selected;
    this._simulationRunService.saveConfig()
  }

}
