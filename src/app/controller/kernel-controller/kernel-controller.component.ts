import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { DataService } from '../../services/data/data.service';
import { ControllerConfigService } from '../../config/controller-config/controller-config.service';


@Component({
  selector: 'app-kernel-controller',
  templateUrl: './kernel-controller.component.html',
  styleUrls: ['./kernel-controller.component.css']
})
export class KernelControllerComponent implements OnInit {
  public options: any;
  @Output() kernelChange = new EventEmitter();

  constructor(
    private _controllerConfigService: ControllerConfigService,
    public _dataService: DataService,
  ) {
  }

  ngOnInit() {
  }

  params() {
    return this._controllerConfigService.config.kernel.params;
  }

  onChange(id, value) {
    this._dataService.data.kernel[id] = value;
    this.kernelChange.emit()
  }

}
