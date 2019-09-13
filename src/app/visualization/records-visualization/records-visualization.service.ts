import { Injectable, EventEmitter } from '@angular/core';

import * as d3 from 'd3';


@Injectable({
  providedIn: 'root'
})
export class RecordsVisualizationService {
  public init: EventEmitter<any> = new EventEmitter();
  public update: EventEmitter<any> = new EventEmitter();
  public method: string = 'chart';
  public binsize: any = 10.;
  public barmode: string = 'overlay';
  public barmodes: any[] = [
    { value: 'group', label: 'Group' },
    { value: 'overlay', label: 'Overlay' },
    { value: 'stack', label: 'Stack' },
    // {value: 'relative', label: 'Relative'},
  ];
  public barnorms: any[] = [
    { value: '', label: 'Default' },
    { value: 'fraction', label: 'Fraction' },
    { value: 'percent', label: 'Percent' },
  ];
  public barnorm: string = '';
  private config: any = {};

  constructor(
  ) {
    let configJSON = localStorage.getItem('network-config');
    if (configJSON) {
      this.config = JSON.parse(configJSON);
    }
  }

  nodeColor(node) {
    if (node == undefined) return '#00000';
    let colors = this.config.color.cycle;
    return node['color'] || colors[node.idx % colors.length];
  }

}
