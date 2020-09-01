import { Component, OnInit, Input } from '@angular/core';

import { ConnectionProjections } from '../../../components/connection/connectionProjections';


@Component({
  selector: 'app-connection-projections',
  templateUrl: './connection-projections.component.html',
  styleUrls: ['./connection-projections.component.scss']
})
export class ConnectionProjectionsComponent implements OnInit {
  @Input() projections: ConnectionProjections;

  constructor(
  ) { }

  ngOnInit() {
  }

  get config(): any {
    return this.projections.config.data;
  }

  onSelectionChange(event: any): void {
    this.projections[event.option.value] = event.option.selected;
  }

}
