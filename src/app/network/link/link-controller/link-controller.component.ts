import { Component, Input, OnInit } from '@angular/core';

import { Connection } from '../../../components/connection';


@Component({
  selector: 'app-link-controller',
  templateUrl: './link-controller.component.html',
  styleUrls: ['./link-controller.component.scss'],
})
export class LinkControllerComponent implements OnInit {
  @Input() connection: Connection;
  public connRules: any[] = [];
  public synModels: any[] = [];
  public srcIdxOptions: any = {
    label: 'Source Indices',
    value: []
  };
  public tgtIdxOptions: any = {
    label: 'Target Indices',
    value: []
  };

  constructor(
  ) { }

  ngOnInit() {
    // console.log('Update connection controller')
    if (this.connection == undefined) return
    if (!this.connection.hasProjections()) {
      this.connRules = this.connection.config.data.rules;
      this.synModels = this.connection.network.project.app.filterModels('synapse');
    }
  }

}
