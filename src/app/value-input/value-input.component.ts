import { Component, OnInit, Input } from '@angular/core';

import { SimulationService } from '../shared/services/simulation/simulation.service';

import { faEraser } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-value-input',
  templateUrl: './value-input.component.html',
  styleUrls: ['./value-input.component.css']
})
export class ValueInputComponent implements OnInit {
  @Input() id: any;
  @Input() data: any;
  @Input() options: any = {};

  public faEraser = faEraser;

  constructor(
    private _simulationService: SimulationService,
  ) { }

  ngOnInit() {
  }

  changed(event) {
    var value = event.target.value;
    if (value.length == 0) {
      this.data[this.id] = parseFloat(this.options.value);
    } else {
      this.data[this.id] = parseFloat(value);
    }
    this._simulationService.run()
  }

  setDefaultValue() {
    this.data[this.id] = parseFloat(this.options.value);
    this._simulationService.run()
  }

}
