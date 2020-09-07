import { Injectable, EventEmitter } from '@angular/core';

import * as d3 from 'd3';
import * as PlotlyJS from 'plotly.js-cartesian-dist';


@Injectable({
  providedIn: 'root'
})
export class ActivityChartPanelService {
  private _panel: any;
  private _panelSelected: string[];
  private _panelOrder: string[];

  constructor() {
    this._panel = {
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
    };
    this._panelSelected = [];
    this._panelOrder = ['input', 'analog', 'spike', 'histogram'];
  }

  get panel(): any {
    return this._panel;
  }

  get panelSelected(): string[] {
    return this._panelSelected;
  }

  set panelSelected(value: string[]) {
    this._panelSelected = value;
  }

  get panelOrder(): string[] {
    return this._panelOrder;
  }

  setPanelSizes(): void {
    const numPanels: number = this._panelSelected.length;
    this._panelOrder.forEach((p: string) => {
      this._panel[p].size = 0;
    })

    this._panelSelected.map((p, i) => {
      if (p === 'input') {
        this._panel[p].size = [1, 1, 1, 1][numPanels - 1];
      }
      if (p === 'analog') {
        this._panel[p].size = [1, 1, 2, 2][numPanels - 1];
      }
      if (p === 'spike') {
        this._panel[p].size = [1, 4, 2, 2][numPanels - 1];
      }
      if (p === 'histogram') {
        this._panel[p].size = [1, 1, 1, 1][numPanels - 1];
      }
    })
    const sizes: number[] = this._panelSelected.map(p => this.panel[p].size);
    const totalSize: number = sizes.reduce((a, b) => a + b, 0);
    this._panelSelected.map((p, i) => this._panel[p].size = Math.round(sizes[i] / totalSize * 100));
  }

}
