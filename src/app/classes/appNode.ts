import { Data } from './data';


export class AppNode {
  idx: number;
  position: any;
  display: string[];
  params: any;
  global_ids?: number[];
  positions: number[][]; // TODO: positions should be in collection
  color: any;

  constructor(
    data: any = {},
  ) {
    this.idx = data.idx;
    this.position = data.position || {};
    this.display = data.display || [];
    this.params = data.params || {};
    this.positions = data.positions;
    this.color = data.color;
  }

  clean(data: Data): void {
    this.global_ids = undefined;
    this.cleanRecColor(data)
  }

  cleanRecColor(data: Data): void {
    if (data.simulation.collections[this.idx].element_type != 'recorder') return
    var links = data.simulation.connectomes.filter(link => (link.source == this.idx || link.target == this.idx));
    if (links.length == 1) {
      var link = links[0];
      var nodeIdx = link.source != this.idx ? link.source : link.target;
      if (this.color == undefined && this.idx != nodeIdx) {
        this.color = nodeIdx;
      }
      if (this.color == this.idx) {
        this.color = undefined;
      }
    } else {
      this.color = undefined;
    }
  }
}
