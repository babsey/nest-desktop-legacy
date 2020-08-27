import * as math from 'mathjs';

import { Activity } from '../activity';
import { ActivityChartGraph } from './activityChartGraph';


export class Panel {
  graph: ActivityChartGraph;        // parent

  private _data: any[] = [];
  layout: any = {
    yaxis: {
      title: '',
      height: 1,
    }
  };

  constructor(graph: ActivityChartGraph) {
    this.graph = graph;
  }

  get activities(): Activity[] {
    return this.graph.project.activities;
  }

  updateLayout(idx: number): void {
    const height: number = this.layout.yaxis.height;
    const panels: Panel[] = this.graph.panels.filter(panel => panel.data.length > 0);
    const heights: number[] = panels.map(panel => panel.layout.yaxis.height);
    const heightTotal: number = math.sum(heights);
    heights.reverse()
    const ratio: number = 1. / heightTotal - (panels.length * 0.02);
    const heightCumsum: number[] = heights.map((sum => (value: number) => sum += value)(0));
    const steps = heightCumsum.map(h => h / heightTotal)
    steps.unshift(0)
    const yaxis = panels.length - idx;
    const domain: number[] = [steps[yaxis - 1] + 0.01, steps[yaxis] - 0.01];
    this.layout.yaxis['domain'] = domain;
    this._data.forEach(d => {
      d['panelIdx'] = idx;
      d['yaxis'] = 'y' + (panels.length - idx);
    });
  }

  public get data() {
    return this.data;
  }

  public set data(newData: any[]) {
    this.data = newData;
  }

}
