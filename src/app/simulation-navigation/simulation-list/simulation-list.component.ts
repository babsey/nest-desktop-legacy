import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MdePopoverTrigger } from '@material-extended/mde';

import { Data } from '../../classes/data';


@Component({
  selector: 'app-simulation-list',
  templateUrl: './simulation-list.component.html',
  styleUrls: ['./simulation-list.component.scss']
})
export class SimulationListComponent implements OnInit {
  @Input() id: string = '';
  @Input() popover: boolean = false;
  @Input() simulations: Data[];
  @Output() select: EventEmitter<any> = new EventEmitter();
  public simulation: Data;

  constructor() {
  }

  ngOnInit() {
    // console.log('Simulation list')
  }

  view(simulation, ref: MdePopoverTrigger) {
    if (this.popover) {
      this.simulation = simulation;
      ref.openPopover();
    } else {
      ref.closePopover()
    }
  }

}
