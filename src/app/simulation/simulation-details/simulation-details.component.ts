import { Component, OnInit, Input } from '@angular/core';

import { Data } from '../../classes/data';

import { enterAnimation } from '../../animations/enter-animation';


@Component({
  selector: 'app-simulation-details',
  templateUrl: './simulation-details.component.html',
  styleUrls: ['./simulation-details.component.scss'],
  animations: [ enterAnimation ],
})
export class SimulationDetailsComponent implements OnInit {
  @Input() data: Data;

  constructor(
  ) { }

  ngOnInit(): void {
  }

}
