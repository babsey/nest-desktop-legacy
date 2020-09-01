import { Component, OnInit, Input } from '@angular/core';

import { Connection } from '../../../components/connection/connection';


@Component({
  selector: 'app-connection-menu',
  templateUrl: './connection-menu.component.html',
  styleUrls: ['./connection-menu.component.scss']
})
export class ConnectionMenuComponent implements OnInit {
  @Input() connection: Connection;

  constructor(
  ) { }

  ngOnInit() {
  }

  customSources(): void {
    this.connection.rule = 'all_to_all';
    this.connection['src_idx'] = [];
  }

  allSources(): void {
    delete this.connection['src_idx'];
  }

  customTargets(): void {
    this.connection.rule = 'all_to_all';
    this.connection['tgt_idx'] = [];
  }

  allTargets(): void {
    delete this.connection['tgt_idx'];
  }

  deleteConnection(): void {
    this.connection.network.deleteConnection(this.connection);
  }

}
