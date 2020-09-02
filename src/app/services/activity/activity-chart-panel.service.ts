import { Injectable, EventEmitter } from '@angular/core';

import * as d3 from 'd3';
import * as PlotlyJS from 'plotly.js-cartesian-dist';


@Injectable({
  providedIn: 'root'
})
export class ActivityChartPanelService {
  public panel: any = {};
  public panelSelected: string[] = [];
  public panelOrder: string[] = ['input', 'analog', 'spike', 'histogram'];

  constructor() {
    this.panelInit();
  }

  panelInit(): void {
    this.panel = {
      'input': {
        'size': 0,
        'ylabel': 'Current [pA]',
        'yaxis': 4,
      },
      'analog': {
        'size': 0,
        'ylabel': 'Membrane potential [mV]',
        'yaxis': 3,
        'threshold': false,
      },
      'spike': {
        'size': 0,
        'ylabel': 'Neuron ID',
        'yaxis': 2,
      },
      'histogram': {
        'size': 0,
        'ylabel': 'Spike count',
        'yaxis': 1,
      }
    }
  }

  setPanelSizes(): void {
    const numPanels: number = this.panelSelected.length;
    this.panelOrder.map(p => {
      this.panel[p].size = 0;
    })

    this.panelSelected.map((p, i) => {
      if (p === 'input') {
        this.panel[p].size = [1, 1, 1, 1][numPanels - 1];
      }
      if (p === 'analog') {
        this.panel[p].size = [1, 1, 2, 2][numPanels - 1];
      }
      if (p === 'spike') {
        this.panel[p].size = [1, 4, 2, 2][numPanels - 1];
      }
      if (p === 'histogram') {
        this.panel[p].size = [1, 1, 1, 1][numPanels - 1];
      }
    })
    const sizes: number[] = this.panelSelected.map(p => this.panel[p].size);
    const totalSize: number = sizes.reduce((a, b) => a + b, 0);
    this.panelSelected.map((p, i) => this.panel[p].size = Math.round(sizes[i] / totalSize * 100));
  }

}
