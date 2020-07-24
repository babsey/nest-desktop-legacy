import { Component, OnInit, Input } from '@angular/core';

import { Kernel } from '../../components/kernel';


@Component({
  selector: 'app-kernel-controller',
  templateUrl: './kernel-controller.component.html',
  styleUrls: ['./kernel-controller.component.scss']
})
export class KernelControllerComponent implements OnInit {
  @Input() kernel: Kernel;
  public params: any[];

  constructor(
  ) {
  }

  ngOnInit() {
    this.params = this.kernel.config.data.params || [];
  }

}
