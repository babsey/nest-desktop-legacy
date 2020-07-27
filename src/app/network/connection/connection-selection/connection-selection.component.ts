import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { Connection } from '../../../components/connection';


@Component({
  selector: 'app-connection-selection',
  templateUrl: './connection-selection.component.html',
  styleUrls: ['./connection-selection.component.scss'],
})
export class ConnectionSelectionComponent implements OnInit {
  @Input() connection: Connection;

  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
  ) { }

  ngOnInit() {
  }

  onSelectionChange(event: MouseEvent) {
    const value = event['option'].value;
    const selected = event['option'].selected;
    this.connection.synapse.params.find(param => param.id === value).visible = selected;
  }

}
