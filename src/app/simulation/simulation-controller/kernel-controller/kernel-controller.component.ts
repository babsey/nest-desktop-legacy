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
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  public options: any;

  constructor(
    private _simulationConfigService: SimulationConfigService,
  ) {
  }

  ngOnInit() {
  }

  params(): any {
    return this._simulationConfigService.config.controller.kernel.params;
  }

  onChange(value: any): void {
    this.dataChange.emit(this.data)
  }

}
