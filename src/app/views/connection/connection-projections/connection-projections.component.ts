import { Component, OnInit, Input } from '@angular/core';

import { ConnectionProjections } from '../../../components/connection/connectionProjections';


@Component({
  selector: 'app-connection-projections',
  templateUrl: './connection-projections.component.html',
  styleUrls: ['./connection-projections.component.scss']
})
export class ConnectionProjectionsComponent implements OnInit {
  @Input() projections: ConnectionProjections;
  private _connectionTypes: any[];

  constructor() {
  }

  ngOnInit() {
    this._connectionTypes = this.config.connectionTypes;
  }

  get config(): any {
    return this.projections.config;
  }

  get connectionTypes(): any[] {
    return this._connectionTypes;
  }

  onSelectionChange(event: any): void {
    this.projections.config[event.option.value] = event.option.selected;
  }

}
