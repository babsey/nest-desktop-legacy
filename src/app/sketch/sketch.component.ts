import { Component, OnInit, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';

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

}
