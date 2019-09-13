import { Injectable } from '@angular/core';

import { NetworkConfigService } from '../network-config/network-config.service';


@Injectable({
  providedIn: 'root'
})
export class ColorService {
  public schemes: any;

  constructor(
    private _networkConfigService: NetworkConfigService,
  ) {
    this.schemes = {
      category10: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
      paired: ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928'],
      set1: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'],
      set2: ['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f','#e5c494','#b3b3b3'],
      set3: ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
    }
  }

  colors() {
    return Array.apply([], this._networkConfigService.config.color.cycle);
  }

  node(node) {
    if (node.hasOwnProperty('color')) { return node['color'] }
    let colors = this._networkConfigService.config.color.cycle;
    return colors[node.idx % colors.length];
  }

  connectome(connectome) {
    if (connectome.hasOwnProperty('syn_spec')) {
      if (connectome['syn_spec'].hasOwnProperty('weight')) {
        return this.weight(connectome['syn_spec']['weight'])
      }
    }
    return this.weight(1);
  }

  weight(value) {
    return value < 0 ? '#b34846' : '#467ab3';
  }

  schemesKeys() {
    return Object.keys(this.schemes)
  }

}
