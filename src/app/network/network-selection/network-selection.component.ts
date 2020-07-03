import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { NetworkService } from '../services/network.service';

import { AppNode } from '../../classes/appNode';
import { AppConnection } from '../../classes/appConnection';
import { Data } from '../../classes/data';
import { SimNode } from '../../classes/simNode';


@Component({
  selector: 'app-network-selection',
  templateUrl: './network-selection.component.html',
  styleUrls: ['./network-selection.component.scss']
})
export class NetworkSelectionComponent implements OnInit, OnChanges {
  @Input() data: Data;
  @Output() appChange: EventEmitter<any> = new EventEmitter();
  @Output() dataChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private _networkService: NetworkService,
  ) { }

  ngOnInit(): void {
    // console.log('Init network selection')
  }

  ngOnChanges(): void {
    // console.log('Change network selection')
  }

  collection(idx: number): SimNode {
    return this.data.simulation.collections[idx];
  }

  isSelected(elementType: string): boolean {
    return this._networkService.elementType == null || this._networkService.elementType == elementType;
  }

  isSelectedSource(link: AppConnection): boolean {
    var connectome = this.data.simulation.connectomes[link.idx];
    var collection = this.data.simulation.collections[connectome.source];
    return this.isSelected(collection.element_type)
  }

  onDataChange(data): void {
    this.dataChange.emit(this.data);
  }

  onNodeChange(node: AppNode): void {
    this.appChange.emit(this.data.app)
  }

}
