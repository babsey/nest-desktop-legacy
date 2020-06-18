import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Data } from '../../classes/data';
import { Record } from '../../classes/record';


@Component({
  selector: 'app-simulation-sidenav',
  templateUrl: './simulation-sidenav.component.html',
  styleUrls: ['./simulation-sidenav.component.scss']
})
export class SimulationSidenavComponent implements OnInit {
  @Input() data: Data;
  @Input() mode: string;
  @Input() records: Record[];
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  @Output() appChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onDataChange(data: Data): void {
    // console.log('Change input value in node selection')
    this.dataChange.emit(this.data)
  }

  onAppChange(data: Data): void {
    this.appChange.emit(this.data.app)
  }

  height(): number {
    return window.innerHeight - 40;
  }

}
