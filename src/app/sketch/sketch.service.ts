import {
  Injectable,
  EventEmitter
} from '@angular/core';
import { MatSnackBar } from '@angular/material';

import * as d3 from 'd3';

import { ColorService } from '../services/color/color.service';
import { ConfigService } from '../config/config.service';
import { DataService } from '../services/data/data.service';


@Injectable({
  providedIn: 'root'
})
export class SketchService {
  public options: any = {
    width: 0,
    height: 0,
    node: {
      radius: 23,
    },
    link: {
      xRotation: 0,
    }
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
    private _configService: ConfigService,
    private _dataService: DataService,
    private snackBar: MatSnackBar,
  ) {
    this.update = new EventEmitter();
  }

  draw() {
    this._dataService.options.edit = true;
    this.resetMouseVars()
  }

  label(model) {
    return this._configService.config.nest.model[model].label;
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

  drawPath(source, target, isTargetNode=false) {
    var x1 = source.x,
      y1 = source.y,
      x2 = target.x,
      y2 = target.y,
      dx = x2 - x1,
      dy = y2 - y1,
      dr = Math.sqrt(dx * dx + dy * dy),
      r = this.options.node.radius + 5,

      // Defaults for normal edge.
      drx = dr,
      dry = dr,
      xRotation = this.options.link.xRotation, // degrees
      largeArc = 0, // 1 or 0
      sweep = 1; // 1 or 0

    // Self edge.
    if (x1 === x2 && y1 === y2) {
      // Fiddle with this angle to get loop oriented.
      xRotation = this.options.link.xRotation;

      // Needs to be 1.
      largeArc = 1;

      // Change sweep to change orientation of loop.
      sweep = 0;

      // Make drx and dry different to get an ellipse
      // instead of a circle.
      drx = 23;
      dry = 23;

      // For whatever reason the arc collapses to a point if the beginning
      // and ending points of the arc are the same, so kludge it.
      x1 = x1 - r / 2 * Math.sqrt(2);
      y1 = y1 + r / 2 * Math.sqrt(2);
      x2 = x2 + r / 2 * Math.sqrt(2);
      y2 = y2 + r / 2 * Math.sqrt(2);
    } else {
      x1 = x1 + (dx / dr * r);
      y1 = y1 + (dy / dr * r);
      if (isTargetNode) {
        x2 = x2 - (dx / dr * r);
        y2 = y2 - (dy / dr * r);
      } else {
        x2 = x2 - (dx / dr * 5) * Math.sqrt(2);
        y2 = y2 - (dy / dr * 5) * Math.sqrt(2);
      }
    }
    return 'M' + x1 + ',' + y1 + 'A' + drx + ',' + dry + ' ' + xRotation + ',' + largeArc + ',' + sweep + ' ' + x2 + ',' + y2;
  };

}
