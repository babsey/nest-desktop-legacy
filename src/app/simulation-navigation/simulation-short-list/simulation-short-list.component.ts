import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MdePopoverTrigger } from '@material-extended/mde';

import { Data } from '../../classes/data';


@Component({
  selector: 'app-simulation-short-list',
  templateUrl: './simulation-short-list.component.html',
  styleUrls: ['./simulation-short-list.component.scss']
})
export class SimulationShortListComponent implements OnInit {
  @Input() activeId: string = '';
  @Input() popover: boolean = false;
  @Input() simulations: Data[];
  @Output() select: EventEmitter<any> = new EventEmitter();
  public simulation: Data;

  constructor() {
  }

  ngOnInit(): void {
    // console.log('Simulation short list')
  }

  shortLabel(label: string): string {
    return label.slice(0, 5)
  }

  view(simulation: Data, ref: MdePopoverTrigger): void {
    if (this.popover) {
      this.simulation = simulation;
      ref.openPopover();
    } else {
      ref.closePopover()
    }
  }

}
