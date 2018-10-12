import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { SimulationService } from '../shared/services/simulation/simulation.service';

import { faEraser } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-value-slider',
  templateUrl: './value-slider.component.html',
  styleUrls: ['./value-slider.component.css']
})
export class ValueSliderComponent implements OnInit, OnChanges {
  @Input() id: any;
  @Input() data: any;
  @Input() options: any = {};

  public faEraser = faEraser;

  constructor(
    private _simulationService: SimulationService,
    public snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (!(this.id in this.data)) {
      this.data[this.id] = this.options.value;
    }
  }

  sliderChanged() {
    this._simulationService.run()
  }

  inputChanged(event) {
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
