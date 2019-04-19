import { Component, OnInit, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';

import { DataService } from '../services/data/data.service';
import { SketchService } from './sketch.service';

@Component({
  selector: 'app-sketch',
  templateUrl: './sketch.component.html',
  styleUrls: ['./sketch.component.css']
})
export class SketchComponent implements OnInit {
  @Input() data: any = {};
  @Input() width: number;
  @Input() height: number;
  @Input() drawing: boolean = false;
  private selector: d3.Selection;

  constructor(
    private _dataService: DataService,
    public _sketchService: SketchService,
    private elementRef: ElementRef,
  ) {
    this.selector = d3.select(elementRef.nativeElement);
  }

  ngOnInit() {
    var _this = this;

    this.selector.on('mouseleave', function() {
      _this._sketchService.events.sourceNode = null;
      _this.selector.selectAll('.select').remove()
      _this._sketchService.update.emit();
    })
  }

  undo() {
    this._dataService.undo()
    setTimeout(() => this._sketchService.update.emit(), 100)
  }

  redo() {
    this._dataService.redo()
    setTimeout(() => this._sketchService.update.emit(), 100)
  }

  delete() {
    if (this._sketchService.selected.node) {
      var idx = this._sketchService.selected.node.idx;
      this._dataService.deleteNode(idx)
    } else if (this._sketchService.selected.link) {
      var idx = this._sketchService.selected.link.idx;
      this._dataService.deleteLink(idx)
    }
    this._sketchService.resetMouseVars()
    this._sketchService.update.emit()
  }

  clear() {
    // console.log('Network sketch sheet delete')
    this._sketchService.draw(true);
    this._dataService.history(this._dataService.data)
    this._dataService.records = [];
    this._dataService.data.connectomes = [];
    this._dataService.data.collections = [];
    this._sketchService.update.emit()
  }


}
