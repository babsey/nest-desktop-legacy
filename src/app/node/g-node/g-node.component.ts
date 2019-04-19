import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ColorService } from '../../services/color/color.service';
import { SketchService } from '../../sketch/sketch.service';


@Component({
  selector: '[app-node]',
  templateUrl: './g-node.component.html',
  styleUrls: ['./g-node.component.css']
})
export class NodeComponent implements OnInit {
  @Input() node: any;
  @Output() nodeClick = new EventEmitter();

  constructor(
    public _colorService: ColorService,
    public _sketchService: SketchService,
  ) { }

  ngOnInit() {
  }

}
