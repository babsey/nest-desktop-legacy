import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { NetworkService } from '../services/network.service';


import { Data } from '../../classes/data';


@Component({
  selector: 'app-network-selection',
  templateUrl: './network-selection.component.html',
  styleUrls: ['./network-selection.component.scss']
})
export class NetworkSelectionComponent implements OnInit, OnChanges {
  @Input() data: Data;
  @Output() selectionChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private _networkService: NetworkService,
  ) { }

  ngOnInit() {
    // console.log('Init network selection')
  }

  ngOnChanges() {
    // console.log('Change network selection')
  }

  collection(idx) {
    return this.data.simulation.collections[idx];
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

  onSelectionChange(data) {
    this.selectionChange.emit(data)
  }

}
