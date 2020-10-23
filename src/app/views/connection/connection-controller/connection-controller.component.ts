import { Component, Input, OnInit } from '@angular/core';

import { Connection } from '../../../components/connection/connection';


@Component({
  selector: 'app-connection-controller',
  templateUrl: './connection-controller.component.html',
  styleUrls: ['./connection-controller.component.scss'],
})
export class ConnectionControllerComponent implements OnInit {
  @Input() connection: Connection;
  private _connRules: any[] = [];
  private _synModels: any[] = [];
  private _srcIdxOptions: any;
  private _tgtIdxOptions: any;

  constructor() {
    this._srcIdxOptions = {
      label: 'Source Indices',
      value: []
    };
    this._tgtIdxOptions = {
      label: 'Target Indices',
      value: []
    };
  }

  ngOnInit() {
    // console.log('Update connection controller')
    if (this.connection === undefined) { return; }
    if (!this.connection.hasProjections()) {
      this._connRules = this.connection.config.rules;
      this._synModels = this.connection.network.project.app.filterModels('synapse');
    }
  }

  get connRules(): any[] {
    return this._connRules;
  }

  get synModels(): any[] {
    return this._synModels;
  }

  get srcIdxOptions(): any {
    return this._srcIdxOptions;
  }

  get tgtIdxOptions(): any {
    return this._tgtIdxOptions;
  }

}
