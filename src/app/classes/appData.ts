import { Data } from './data';
import { AppModel } from './appModel';
import { AppNode } from './appNode';
import { AppLink } from './appLink';

export class AppData {
  kernel: any;
  models: any;
  nodes: AppNode[];
  links: AppLink[];
  factors?: any[];

  constructor(
    data: any = {},
  ) {
    this.kernel = data.kernel || {};
    this.models = data.models || {};
    this.nodes = data.nodes ? data.nodes.map(d => new AppNode(d)) : [];
    this.links = data.links ? data.links.map(d => new AppLink(d)) : [];
  }

  addModel(name: string): void {
    this.models[name] = new AppModel();
  }

  addNode(point: number[]): void {
    this.nodes.push(new AppNode({
      idx: this.nodes.length,
      position: { x: point[0], y: point[1] },
    }))
  }

  addLinks(): void {
    this.links.push(new AppLink({
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
