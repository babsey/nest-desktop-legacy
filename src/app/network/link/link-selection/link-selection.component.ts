import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { MatMenuTrigger } from '@angular/material/menu';

import { Connection } from '../../../components/connection';


@Component({
  selector: 'app-link-selection',
  templateUrl: './link-selection.component.html',
  styleUrls: ['./link-selection.component.scss'],
})
export class LinkSelectionComponent implements OnInit {
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
