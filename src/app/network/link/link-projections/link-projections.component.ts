import { Component, OnInit, Input } from '@angular/core';

import { NetworkConfigService } from '../../network-config/network-config.service';

import { Connection } from '../../../components/connection';


@Component({
  selector: 'app-link-projections',
  templateUrl: './link-projections.component.html',
  styleUrls: ['./link-projections.component.scss']
})
export class LinkProjectionsComponent implements OnInit {
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
