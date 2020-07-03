import { Data } from './data';
import { AppNode } from './appNode';
import { AppConnection } from './appConnection';

export class AppData {
  kernel: any;
  models: any;
  nodes: AppNode[];
  links: AppConnection[];
  factors?: any[];

  constructor(
    data: any = {},
  ) {
    this.kernel = data.kernel || {};
    this.nodes = data.nodes ? data.nodes.map(d => new AppNode(d)) : [];
    this.links = data.links ? data.links.map(d => new AppConnection(d)) : [];
  }

  addNode(point: number[]): void {
    this.nodes.push(new AppNode({
      idx: this.nodes.length,
      position: { x: point[0], y: point[1] },
    }))
  }

  addLinks(): void {
    this.links.push(new AppConnection({
      idx: this.links.length,
    }))
  }

  clean(data: Data): void {
    this.cleanKernel()
    this.nodes.map(node => node.clean(data))
  }

  cleanKernel(): void {
    this.kernel = { time: 0. };
    if (!this.kernel.hasOwnProperty('resolution')) {
      this.kernel['resolution'] = 0.1;
    }
  }

}
