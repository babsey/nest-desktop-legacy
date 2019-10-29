import { Injectable, EventEmitter } from '@angular/core';

import * as d3 from 'd3';


@Injectable({
  providedIn: 'root'
})
export class PlotRecordsService {
  public binsize: any = 10.;
  public barmode: string = 'overlay';
  public barnorm: string = '';
  private config: any = {};
  private labels: string = 'abcdefghijklmnopqrstuvwxyz';

  constructor() {
    let configJSON = localStorage.getItem('network-config');
    if (configJSON) {
      this.config = JSON.parse(configJSON);
    }
  }

  plot(idx: number, x: number[], y: number[], color: string, name: string = '', config: any = {}, yaxis: string = 'y3'): any {
    return {
      mode: 'lines',
      type: 'scattergl',
      idx: idx,
      x: x,
      y: y,
      legendgroup: config['legendgroup'] || '',
      hoverinfo: config['hoverinfo'] || 'all',
      showlegend: config['showlegend'] != undefined ? config['showlegend'] : true,
      opacity: config['opacity'] || 1.,
      name: name,
      line: {
        width: 1.5,
        color: color,
        dash: config['line.dash'] || 'none',
      },
      yaxis: yaxis,
    }
  }

  scatter(idx: number, x: number[], y: number[], color: string, name: string = '', config: any = {}, yaxis: string = 'y2'): any {
    return {
      mode: 'markers',
      type: 'scattergl',
      idx: idx,
      x: x,
      y: y,
      name: name,
      legendgroup: 'spikes' + idx,
      hoverinfo: config.hasOwnProperty('hoverinfo') ? config['hoverinfo'] : 'x',
      visible: config.hasOwnProperty('visible') ? config['visible'] : true,
      showlegend: config.hasOwnProperty('showlegend') ? config['showlegend'] : true,
      opacity: config.hasOwnProperty('opacity') ? config['opacity'] : 1.,
      marker: {
        size: 5,
        color: color,
      },
      yaxis: yaxis
    }
  }

  scatter3d(idx: number, x: number[], y: number[], z: number[], color: string, config: any = {}, yaxis: string = 'y2'): any {
    return {
      mode: 'markers',
      type: 'scatter3d',
      idx: idx,
      x: x,
      y: y,
      z: z,
      hoverinfo: 'none',
      showlegend: false,
      opacity: .6,
      marker: {
        size: 2,
        color: color,
      },
      yaxis: yaxis
    }
  }

  histogram(idx: number, x: number[], start: number = 0., end: number = 1000., size: number = 10., color: string, config: any = {}, yaxis: string = 'y1'): any {
    return {
      type: 'histogram',
      idx: idx,
      source: 'x',
      x: x,
      histfunc: 'count',
      text: 'auto',
      name: '',
      legendgroup: 'spikes' + idx,
      hoverinfo: config.hasOwnProperty('hoverinfo') ? config['hoverinfo'] : 'y',
      visible: config.hasOwnProperty('visible') ? config['visible'] : true,
      showlegend: config.hasOwnProperty('showlegend') ? config['showlegend'] : false,
      opacity: config.hasOwnProperty('opacity') ? config['opacity'] : .6,
      xbins: {
        start: start,
        end: end + size,
        size: size,
      },
      marker: {
        color: color,
        line: {
          color: 'white',
          width: 1,
        }
      },
      yaxis: yaxis
    }
  }

}
