import { Component, Input, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { Model } from '../../../components/model/model';
import { Node } from '../../../components/node/node';
import { Parameter } from '../../../components/parameter';
import { Project } from '../../../components/project/project';


@Component({
  selector: 'app-node-selection',
  templateUrl: './node-selection.component.html',
  styleUrls: ['./node-selection.component.scss'],
})
export class NodeSelectionComponent implements OnInit {
  @Input() node: Node;
  @Input() selection = false;

  constructor() {
  }

  ngOnInit() {
    const param = this.node.params[0];
  }

  onSelectionChange(event: MouseEvent) {
    const value = event['option'].value;
    const selected = event['option'].selected;
    this.node.params.find((param: Parameter) => param.id === value).visible = selected;
  }

}
