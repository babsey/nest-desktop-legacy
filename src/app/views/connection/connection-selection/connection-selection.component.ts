import { Component, Input, OnInit } from '@angular/core';

import { Connection } from '../../../components/connection/connection';


@Component({
  selector: 'app-connection-selection',
  templateUrl: './connection-selection.component.html',
  styleUrls: ['./connection-selection.component.scss'],
})
export class ConnectionSelectionComponent implements OnInit {
  @Input() connection: Connection;

  constructor() {
  }

  ngOnInit() {
  }

  onSelectionChange(event: any) {
    const value: string = event.option.value;
    const selected: boolean = event.option.selected;
    this.connection.synapse.params.find(param => param.id === value).visible = selected;
  }

}
