import { Component, Input, OnInit } from '@angular/core';

import { MatMenuTrigger } from '@angular/material/menu';

import { Project } from '../../../components/project';
import { Node } from '../../../components/node';
import { Model } from '../../../components/model';


@Component({
  selector: 'app-node-selection',
  templateUrl: './node-selection.component.html',
  styleUrls: ['./node-selection.component.scss'],
})
export class NodeSelectionComponent implements OnInit {
  @Input() node: Node;
  @Input() selection: boolean = false;

  constructor() {
  }

  ngOnInit() {
    const param = this.node.params[0];
  }

  onSelectionChange(event: MouseEvent) {
    const value = event['option'].value;
    const selected = event['option'].selected;
    this.node.params.find(param => param.id === value).visible = selected;
  }

}
