import { Component, Input, OnInit } from '@angular/core';

import { Connection } from '../../../components/connection/connection';
import { Parameter } from '../../../components/parameter';
import { ProjectionParameter } from '../../../components/connection/projectionParameter';


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

  onSynapseSelectionChange(event: any): void {
    // console.log(event);
    const value: string = event.option.value;
    const selected: boolean = event.option.selected;
    const parameter: Parameter = this.connection.synapse.params.find(
      (param: Parameter) => param.id === value
    );
    parameter.visible = selected;
  }

  onProjectionSelectionChange(event: any): void {
    // console.log(event);
    const value: string = event.option.value;
    const selected: boolean = event.option.selected;
    if (value === 'kernel' && selected) {
      this.connection.projections.numberOfConnections.visible = false;
    }
    if (value === 'numberOfConnections' && selected) {
      this.connection.projections.kernel.visible = false;
    }
    const parameter: ProjectionParameter = this.connection.projections.params.find(
      (param: ProjectionParameter) => param.id === value
    );
    parameter.visible = selected;
  }


}
