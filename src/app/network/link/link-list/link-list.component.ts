import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FormatService } from '../../../services/format/format.service';

import { Connection } from '../../../components/connection';


@Component({
  selector: 'app-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.scss']
})
export class LinkListComponent implements OnInit {
  @Input() connection: Connection;
  @Input() selective: boolean = false;

  constructor(
    public _formatService: FormatService,
  ) { }

  ngOnInit() {
  }

  synWeights(): any {
    if (!this.connection.projections.hasOwnProperty('weights')) {
      return this._formatService.format(1);
    }
    if (!this.connection.projections.weights.hasOwnProperty('parametertype')) {
      return this._formatService.format(this.connection.projections.weights);
    }
    if (this.connection.projections.weights.parametertype == 'constant') {
      return this._formatService.format(this.connection.projections.weights.specs.value);
    }
    return this.connection.projections.weights.parametertype;
  }

  synDelays(): any {
    if (!this.connection.projections.hasOwnProperty('delays')) {
      return this._formatService.format(1);
    }
    if (!this.connection.projections.delays.hasOwnProperty('parametertype')) {
      return this._formatService.format(this.connection.projections.delays);
    }
    if (this.connection.projections.delays.parametertype == 'constant') {
      return this._formatService.format(this.connection.projections.delays.specs.value);
    }
    return this.connection.projections.delays.parametertype;
  }

}
