import { Component, OnInit, Input } from '@angular/core';

import { ColorService } from '../../services/color/color.service';
import { ControllerService } from '../../controller/controller.service';
import { ChartService } from '../../chart/chart.service';
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
    public _colorService: ColorService,
    public _controllerService: ControllerService,
    private _chartService: ChartService,
    public _dataService: DataService,
    public _sketchService: SketchService,
  ) {
  }

  ngOnInit() {
  }

  selectColor(idx, color) {
    console.log(color)
    if (color == 'none') {
      delete this.nodes[idx]['color']
    } else {
      this.nodes[idx]['color'] = color;
    }
    this._sketchService.update.emit()
    this._chartService.init.emit()
  }

}
