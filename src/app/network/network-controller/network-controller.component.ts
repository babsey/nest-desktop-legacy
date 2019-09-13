import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { NetworkControllerService } from './network-controller.service';
import { NetworkService } from '../services/network.service';

import { Data } from '../../classes/data';


@Component({
  selector: 'app-network-controller',
  templateUrl: './network-controller.component.html',
  styleUrls: ['./network-controller.component.scss']
})
export class NetworkControllerComponent implements OnInit {
  @Input() data: Data;
  @Output() appChange: EventEmitter<any> = new EventEmitter();
  @Output() simulationChange: EventEmitter<any> = new EventEmitter();

  constructor(
    public _networkControllerService: NetworkControllerService,
    private _networkService: NetworkService,
  ) { }

  ngOnInit() {
    // console.log('Init network controller')
  }

  collection(idx) {
    return this.data.simulation.collections[idx];
  }

  connectome(idx) {
    return this.data.simulation.connectomes[idx];
  }

  selectElementType(elementType) {
    this._networkService.selectElementType(elementType)
  }

  isSelected(elementType) {
    return this._networkService.elementType == null || this._networkService.elementType == elementType;
  }


  isSelectedPre(link) {
    var connectome = this.data.simulation.connectomes[link.idx];
    var collection = this.data.simulation.collections[connectome.pre];
    return this.isSelected(collection.element_type)
  }

  onAppChange(data) {
    // console.log('App changed')
    this.appChange.emit(data)
  }

  onSimulationChange(data) {
    this.simulationChange.emit(data)
  }

}
