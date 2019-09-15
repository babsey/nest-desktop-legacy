import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  public selected: any = {
    node: null,
    link: null,
  }
  public elementType = null;

  constructor() { }

  resetMouseVars() {
    this.selected.node = null;
    this.selected.link = null;
  }

  isNodeSelected(node, data, unselected: boolean = true) {
    if (this.selected.node) {
      return this.selected.node == node;
    } else if (this.selected.link) {
      var links = data.app.links.filter(link => {
        var connectome = data.simulation.connectomes[link.idx];
        return connectome.pre == node.idx || connectome.post == node.idx;
      })
      var selected = links.filter(link => this.selected.link == link);
      return selected.length > 0;
    }
    return unselected;
  }

  isLinkSelected(link, data, unselected: boolean = true) {
    if (this.selected.link) {
      return this.selected.link == link;
    } else if (this.selected.node) {
      var connectome = data.simulation.connectomes[link.idx];
      var node = data.app.nodes[connectome.pre];
      return this.selected.node == node;
    }
    return unselected;
  }

  selectNode(node: any, elementType: any = null) {
    this.selected.node = this.selected.node == node ? null : node;
    this.elementType = this.selected.node || this.elementType != null ? elementType : null;
    this.selected.link = null;
  }

  selectLink(link: any) {
    this.elementType = null;
    this.selected.node = null;
    this.selected.link = this.selected.link == link ? null : link;
  }

  selectElementType(elementType: string) {
    this.elementType = elementType;
    // this.elementType = this.elementType == elementType ? null : elementType;
    this.resetMouseVars()
  }
}
