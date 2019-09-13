import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SimulationConfigService } from '../../simulation-config/simulation-config.service';

import { Data } from '../../../classes/data';


@Component({
  selector: 'app-kernel-controller',
  templateUrl: './kernel-controller.component.html',
  styleUrls: ['./kernel-controller.component.scss']
})
export class KernelControllerComponent implements OnInit {
  @Input() data: Data;
  @Output() kernelChange: EventEmitter<any> = new EventEmitter();
  public options: any;

  constructor(
    private _simulationConfigService: SimulationConfigService,
  ) {
  }

  ngOnInit() {
  }

  params() {
    return this._simulationConfigService.config.kernel.params;
  }

  onChange(id, value) {
    this.data.simulation.kernel[id] = value;
    this.kernelChange.emit(this.data)
  }

}
