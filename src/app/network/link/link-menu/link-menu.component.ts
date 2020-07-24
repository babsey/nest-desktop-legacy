import { Component, OnInit, Input } from '@angular/core';

import { Connection } from '../../../components/connection';


@Component({
  selector: 'app-link-menu',
  templateUrl: './link-menu.component.html',
  styleUrls: ['./link-menu.component.scss']
})
export class LinkMenuComponent implements OnInit {
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
