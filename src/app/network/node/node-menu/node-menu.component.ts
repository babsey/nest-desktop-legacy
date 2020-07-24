import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { NetworkService } from '../../services/network.service';
import { NetworkSketchService } from '../../network-sketch/network-sketch.service';
import { SimulationEventService } from '../../../simulation/services/simulation-event.service';

import { Node } from '../../../components/node';


@Component({
  selector: 'app-node-menu',
  templateUrl: './node-menu.component.html',
  styleUrls: ['./node-menu.component.scss']
})
export class NodeMenuComponent implements OnInit {
  @Input() node: Node;
  @Input() disabled: boolean = false;

  constructor(
    private _networkService: NetworkService,
    private _networkSketchService: NetworkSketchService,
    private _simulationEventService: SimulationEventService,
  ) { }

  ngOnInit() {
  }

  selectColor(color: string): void {
    this.node.view.color = color;
    // this._networkService.update.emit(this.node.network);
  }

  downloadEvents(): void {
    this._simulationEventService.download(this.node.network.project, this.node);
  }

}
