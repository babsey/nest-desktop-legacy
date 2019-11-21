import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { NetworkService } from '../services/network.service';

import { Data } from '../../classes/data';
import { AppLink } from '../../classes/appLink';
import { SimCollection } from '../../classes/simCollection';


@Component({
  selector: 'app-network-selection',
  templateUrl: './network-selection.component.html',
  styleUrls: ['./network-selection.component.scss']
})
export class NetworkSelectionComponent implements OnInit, OnChanges {
  @Input() data: Data;
  @Output() dataChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private _networkService: NetworkService,
  ) { }

  ngOnInit() {
    // console.log('Init network selection')
  }

  ngOnChanges() {
    // console.log('Change network selection')
  }

  collection(idx: number): SimCollection {
    return this.data.simulation.collections[idx];
  }

  selectElementType(elementType: string): void {
    this._networkService.selectElementType(elementType)
  }

  isSelected(elementType: string): boolean {
    return this._networkService.elementType == null || this._networkService.elementType == elementType;
  }

  isSelectedSource(link: AppLink): boolean {
    var connectome = this.data.simulation.connectomes[link.idx];
    var collection = this.data.simulation.collections[connectome.source];
    return this.isSelected(collection.element_type)
  }

  onDataChange(data) {
    this.dataChange.emit(this.data);
  }

}
