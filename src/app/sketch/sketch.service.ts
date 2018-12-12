import {
  Injectable,
  EventEmitter
} from '@angular/core';
import { MatSnackBar } from '@angular/material';

import * as d3 from 'd3';

import { ColorService } from '../services/color/color.service';
import { DataService } from '../services/data/data.service';


@Injectable({
  providedIn: 'root'
})
export class SketchService {
  public options: any = {
    width: 0,
    height: 0,
  };
  public update: EventEmitter<any>;
  public events = {
    sourceNode: null,
  };
  public selected = {
    node: null,
    link: null,
  }
  private snackBarRef: any;

  constructor(
    private _colorService: ColorService,
    private _dataService: DataService,
    private snackBar: MatSnackBar,
  ) {
    this.update = new EventEmitter();
  }

  draw() {
    this._dataService.options.edit = true;
    this.resetMouseVars()
  }

  save() {
    this._dataService.options.edit = false;
  }

  resetMouseVars() {
    this.selected.node = null;
    this.selected.link = null;
    this.update.emit();
  }

  isSelectedNode(node) {
    if (this.selected.node) return this.selected.node.idx == node.idx
    if (this.selected.link) return this.selected.link.pre == node.idx || this.selected.link.post == node.idx
    return false
  }

  isSelectedNode_or_all(node) {
    if (this.selected.node) return this.selected.node.idx == node.idx
    if (this.selected.link) return this.selected.link.pre == node.idx || this.selected.link.post == node.idx
    return true
  }

  isSelectedLink_or_all(link) {
    if (this.selected.link) return this.selected.link.idx == link.idx
    if (this.selected.node) return this.selected.node.idx == link.pre // || this.selected.node.idx == link.post.idx
    return true
  }

  isSelectedLink(link) {
    if (this.selected.link) return this.selected.link.idx == link.idx
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

  coloredNode() {
    if (this.selected.node) {
      return this._colorService.nodes[this.selected.node.idx];
    }
  }

}
