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

  isSelected(node: any, link: any, unselected: boolean = false) {
    if (this.selected.node && node) return this.selected.node == node;
    if (this.selected.link && link) return this.selected.link == link;
    return unselected
  }

  selectNode(node: any, elementType: any = null) {
    this.selected.node = this.selected.node == node ? null : node;
    this.elementType = this.selected.node || this.elementType!=null ? elementType : null;
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
