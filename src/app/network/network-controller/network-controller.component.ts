import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { NetworkControllerService } from './network-controller.service';
import { NetworkService } from '../services/network.service';

import { Data } from '../../classes/data';
import { AppNode } from '../../classes/appNode';
import { AppConnection } from '../../classes/appConnection';
import { SimNode } from '../../classes/simNode';
import { SimConnection } from '../../classes/simConnection';


@Component({
  selector: 'app-network-controller',
  templateUrl: './network-controller.component.html',
  styleUrls: ['./network-controller.component.scss']
})
export class NetworkControllerComponent implements OnInit {
  @Input() data: Data;
  @Output() appChange: EventEmitter<any> = new EventEmitter();
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  public options: any = {
    min: 0, max: 100, label: 'test',
  };

  constructor(
    private _networkService: NetworkService,
    private _networkControllerService: NetworkControllerService,
  ) { }

  ngOnInit(): void {
  }

  collection(idx: number): SimNode {
    return this.data.simulation.collections[idx];
  }

  connectome(idx: number): SimConnection {
    return this.data.simulation.connectomes[idx];
  }

  isSelected(elementType: string): boolean {
    return this._networkService.elementType == null || this._networkService.elementType == elementType;
  }

  isSelectedSource(link: AppConnection): boolean {
    var connectome = this.data.simulation.connectomes[link.idx];
    var collection = this.data.simulation.collections[connectome.source];
    return this.isSelected(collection.element_type)
  }

  onValueChange(value: number): void {
    this.dataChange.emit(this.data)
  }

  onNodeChange(node: AppNode): void {
    this.appChange.emit(this.data.app)
  }

  onDataChange(data: Data): void {
    // console.log('Network controller on data change')
    this.dataChange.emit(this.data)
  }

}
