import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { NetworkControllerService } from './network-controller.service';
import { NetworkService } from '../services/network.service';

import { Data } from '../../classes/data';
import { AppNode } from '../../classes/appNode';
import { AppLink } from '../../classes/appLink';
import { SimCollection } from '../../classes/simCollection';
import { SimConnectome } from '../../classes/simConnectome';


@Component({
  selector: 'app-network-controller',
  templateUrl: './network-controller.component.html',
  styleUrls: ['./network-controller.component.scss']
})
export class NetworkControllerComponent implements OnInit {
  @Input() data: Data;
  @Output() appChange: EventEmitter<any> = new EventEmitter();
  @Output() dataChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private _networkService: NetworkService,
    private _networkControllerService: NetworkControllerService,
  ) { }

  ngOnInit() {
  }

  collection(idx: number): SimCollection {
    return this.data.simulation.collections[idx];
  }

  connectome(idx: number): SimConnectome {
    return this.data.simulation.connectomes[idx];
  }

  selectElementType(elementType: string): void {
    this._networkService.selectElementType(elementType)
  }

  isSelected(elementType: string): boolean {
    return this._networkService.elementType == null || this._networkService.elementType == elementType;
  }

  isSelectedPre(link: AppLink): boolean {
    var connectome = this.data.simulation.connectomes[link.idx];
    var collection = this.data.simulation.collections[connectome.pre];
    return this.isSelected(collection.element_type)
  }

  onNodeChange(node: AppNode): void {
    this.appChange.emit(this.data.app)
  }

  onDataChange(data: Data): void {
    // console.log('Network controller on data change')
    this.dataChange.emit(this.data)
  }

}
