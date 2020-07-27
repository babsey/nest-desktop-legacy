import { Component, OnInit, Input } from '@angular/core';
import { NetworkConfigService } from '../../network-config/network-config.service';

import { Connection } from '../../../components/connection';


@Component({
  selector: 'app-connection-projections',
  templateUrl: './connection-projections.component.html',
  styleUrls: ['./connection-projections.component.scss']
})
export class ConnectionProjectionsComponent implements OnInit {
  @Input() connection: Connection;
  public config: any;

  constructor(
    private _networkConfigService: NetworkConfigService,
  ) { }

  ngOnInit() {
    this.config = this._networkConfigService.config.projections;
  }

  onSelectionChange(event: any): void {
    this.connection.projections[event.option.value] = event.option.selected;
  }

}
