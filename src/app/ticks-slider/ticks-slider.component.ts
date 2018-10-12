import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { SimulationService } from '../shared/services/simulation/simulation.service';


@Component({
  selector: 'app-ticks-slider',
  templateUrl: './ticks-slider.component.html',
  styleUrls: ['./ticks-slider.component.css']
})
export class TicksSliderComponent implements OnInit, OnChanges {
  @Input() id: any;
  @Input() data: any;
  @Input() options: any = {};
  public value: any;

  constructor(
    private _simulationService: SimulationService,
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (!(this.id in this.data)) {
      this.data[this.id] = this.options.value;
    }
    this.value = this.options.viewSpec.ticks.indexOf(this.data[this.id])
  }


  changed(event) {
    this.data[this.id] = this.options.viewSpec.ticks[event.value];
    this._simulationService.run()
  }

  displayWith(ticks) {
    return (idx) => ticks[idx]
  }
}
