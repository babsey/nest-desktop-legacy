import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NetworkConfigService } from '../network-config/network-config.service';

import { Data } from '../../classes/data';
import { AppNode } from '../../classes/appNode';
import { AppLink } from '../../classes/appLink';
import { Record } from '../../classes/record';
import { SimCollection } from '../../classes/simCollection';
import { SimConnectome } from '../../classes/simConnectome';


@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  public selected: any = {
    node: null,
    link: null,
  }
  public elementType = null;
  public update: EventEmitter<any> = new EventEmitter();
  public recorderChanged: boolean = false;
  public quickView: boolean = false;

  constructor(
    private _networkConfigService: NetworkConfigService,
    private snackBar: MatSnackBar,
  ) { }

  isNodeSelected(node: AppNode, data: Data, unselected: boolean = true, withLink: boolean = true): boolean {
    if (this.selected.node) {
      return this.selected.node == node;
    } else if (this.selected.link) {
      if (!withLink) return false
      var links = data.app.links.filter(link => {
        var connectome = data.simulation.connectomes[link.idx];
        return connectome.source == node.idx || connectome.target == node.idx;
      })
      var selected = links.filter(link => this.selected.link == link);
      return selected.length > 0;
    }
    return unselected;
  }

  isLinkSelected(link: AppLink, data: Data, unselected: boolean = true): boolean {
    if (this.selected.link) {
      return this.selected.link == link;
    } else if (this.selected.node) {
      var connectome = data.simulation.connectomes[link.idx];
      var node = data.app.nodes[connectome.source];
      return this.selected.node == node;
    }
    return unselected;
  }

  selectNode(node: AppNode, elementType: string = null): void {
    this.selected.node = this.selected.node == node ? null : node;
    this.elementType = this.selected.node || this.elementType != null ? elementType : null;
    this.selected.link = null;
  }

  selectLink(link: AppLink): void {
    this.elementType = null;
    this.selected.node = null;
    this.selected.link = this.selected.link == link ? null : link;
  }

  selectElementType(elementType: string): void {
    this.elementType = elementType;
    // this.elementType = this.elementType == elementType ? null : elementType;
    this.resetSelection()
  }

  resetSelection(): void {
    this.selected.node = null;
    this.selected.link = null;
  }

  getPositionsForRecord(data: Data, record: Record): number[][] {
    var node = record.recorder.model == 'spike_detector' ? 'source' : 'target';
    var recorder = record.recorder.model == 'spike_detector' ? 'target' : 'source';
    var nodes = data.simulation.connectomes
      .filter(connectome => connectome[recorder] == record.recorder.idx)
      .filter(connectome => data.app.nodes[connectome[node]].hasOwnProperty('positions'))
      .map(connectome => data.app.nodes[connectome[node]]);
    var positions = [];
    nodes.map(node => positions = positions.concat(node.positions));
    return positions;
  }

}
