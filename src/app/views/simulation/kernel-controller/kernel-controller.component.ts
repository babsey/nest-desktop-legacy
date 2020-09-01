import { Component, OnInit, Input } from '@angular/core';

import { SimulationKernel } from '../../../components/simulation/simulationKernel';


@Component({
  selector: 'app-kernel-controller',
  templateUrl: './kernel-controller.component.html',
  styleUrls: ['./kernel-controller.component.scss']
})
export class KernelControllerComponent implements OnInit {
  @Input() kernel: SimulationKernel;
  public params: any[];

  constructor(
  ) {
  }

  ngOnInit() {
    this.params = this.kernel.config.params || [];
  }

}
