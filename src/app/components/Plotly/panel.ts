import { Activity } from '../activity';
import { ActivityGraph } from './activityGraph';

import * as math from 'mathjs';

export class Panel {
  graph: ActivityGraph;        // parent

  data: any[] = [];
  layout: any = {
    yaxis: {
      title: '',
      height: 1,
    }
  };

  constructor(graph: ActivityGraph) {
    this.graph = graph;
  }

  get activities(): Activity[] {
    return this.graph.project.activities;
  }

  init(): void {

  }

  update(): void {

  }



  updateLayout(idx: number): void {
    const height: number = this.layout.yaxis.height;
    const panels: Panel[] = this.graph.panels.filter(panel => panel.data.length > 0);
    const heights: number[] = panels.map(panel => panel.layout.yaxis.height);
    const heightTotal: number = math.sum(heights);
    heights.reverse()
    const ratio: number = 1. / heightTotal - (panels.length * 0.02);
    const heightCumsum: number[] = heights.map((sum => value => sum += value)(0));
    const steps = heightCumsum.map(h => h / heightTotal)
    steps.unshift(0)
    const yaxis = panels.length - idx;
    const domain: number[] = [steps[yaxis - 1] + 0.01, steps[yaxis] - 0.01];
    this.layout.yaxis['domain'] = domain;
    this.data.forEach(d => {
      d['panelIdx'] = idx;
      d['yaxis'] = 'y' + (panels.length - idx);
    });
  }

  updateColor(): void {

  }
}
