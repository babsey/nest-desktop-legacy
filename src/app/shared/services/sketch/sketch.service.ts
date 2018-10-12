import {
  Injectable,
  EventEmitter
} from '@angular/core';

import * as d3 from 'd3';


@Injectable({
  providedIn: 'root'
})
export class SketchService {
  public options: any;
  public update: EventEmitter<any>;
  public events = {
    sourceNode: null,
  };
  public selected = {
    node: null,
    link: null,
  }

  constructor() {
    this.options = {
      drawing: false,
      width: window.innerWidth,
      height: window.innerHeight - 64,
      nodes: {
        // colors: d3.schemeCategory10,
        // colors: d3.schemePaired,
        colors: [
          ['#1f77b4', 'blue'], 
          ['#ff7f0e','orange'],
          ['#2ca02c','green'],
          ['#d62728', 'red'],
          ['#9467bd', 'purple'],
          ['#8c564b', 'brown'],
          ['#e377c2', 'pink'],
          ['#7f7f7f', 'gray'],
          ['#bcbd22', 'yellow'],
          ['17becf', 'cyan']
        ]
      },
      links: {
        inh: '#b34846',
        exc: '#467ab3'
      },
      background: '#fafafa',
      show: true,
    };

    this.update = new EventEmitter();
  }


  resetMouseVars() {
    this.selected.node = null;
    this.selected.link = null;
    this.update.emit();
  }

  isSelectedNode(node) {
    if (this.selected.node) return this.selected.node == node
    if (this.selected.link) return this.selected.link.pre == node.idx
    return false
  }

  isSelectedNode_or_all(node) {
    if (this.selected.node) return this.selected.node == node
    if (this.selected.link) return this.selected.link.pre == node.idx
    return true
  }

  isSelectedLink_or_all(link) {
    if (this.selected.link) return this.selected.link == link
    if (this.selected.node) return this.selected.node.idx == link.pre // || this.selected.node.idx == link.post.idx
    return true
  }

  isSelectedLink(link) {
    if (this.selected.link) return this.selected.link == link
    if (this.selected.node) return this.selected.node.idx == link.pre // || this.selected.node.idx == link.post.idx
    return false
  }

  toggleSelectNode(node) {
    if (this.selected.node == node) {
      this.selected.node = null;
    } else {
      this.selected.node = node;
    }
    this.selected.link = null;
    this.update.emit()
  }

  toggleSelectLink(link) {
    if (this.selected.link == link) {
      this.selected.link = null;
    } else {
      this.selected.link = link;
    }
    this.selected.node = null;
    this.update.emit()
  }

}
