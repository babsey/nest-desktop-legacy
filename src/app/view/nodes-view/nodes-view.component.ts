import { Component, OnInit, Input } from '@angular/core';

import { ColorService } from '../../services/color/color.service';
import { ControllerService } from '../../controller/controller.service';
import { DataService } from '../../services/data/data.service';
import { SketchService } from '../../sketch/sketch.service';

@Component({
  selector: 'app-nodes-view',
  templateUrl: './nodes-view.component.html',
  styleUrls: ['./nodes-view.component.css']
})
export class NodesViewComponent implements OnInit {
  @Input() nodes: any;
  @Input() selectiveView: any = false;

  constructor(
    private _colorService: ColorService,
    public _controllerService: ControllerService,
    public _dataService: DataService,
    public _sketchService: SketchService,
  ) {
  }

  ngOnInit() {
  }

  color(idx) {
    return this._colorService.nodes[idx % this._colorService.nodes.length]
  }
}
