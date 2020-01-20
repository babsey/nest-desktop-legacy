import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Data } from '../../classes/data';


@Component({
  selector: 'app-simulation-selection',
  templateUrl: './simulation-selection.component.html',
  styleUrls: ['./simulation-selection.component.scss']
})
export class SimulationSelectionComponent implements OnInit {
  @Input() simulations: Data[];
  @Output() select: EventEmitter<any> = new EventEmitter();
  public selected: Data[];

  constructor(
  ) {
  }

  ngOnInit(): void {
    // console.log('Simulation selection')
  }

  selectionSubmit(mode: string): void {
    this.select.emit({ mode: mode, selected: this.selected })
  }
}
