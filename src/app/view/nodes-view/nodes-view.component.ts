import { Component, OnInit, Input } from '@angular/core';

import { ChartService } from '../../chart/chart.service';
import { ColorService } from '../../services/color/color.service';
import { FormatService } from '../../services/format/format.service';
import { ModelService } from '../../model/model.service';
import { ControllerService } from '../../controller/controller.service';
import { DataService } from '../../services/data/data.service';
import { NetworkSimulationService } from '../../network/network-simulation/network-simulation.service';
import { SketchService } from '../../sketch/sketch.service';

@Component({
  selector: 'app-nodes-view',
  templateUrl: './nodes-view.component.html',
  styleUrls: ['./nodes-view.component.css']
})
export class NodesViewComponent implements OnInit {
  @Input() data: any = {};
  @Input() editing: boolean = false;
  @Input() selective: boolean = false;

  constructor(
    private _chartService: ChartService,
    private _networkSimulationService: NetworkSimulationService,
    public _modelService: ModelService,
    public _colorService: ColorService,
    public _formatService: FormatService,
    public _controllerService: ControllerService,
    public _dataService: DataService,
    public _sketchService: SketchService,
  ) {
  }

  ngOnInit() {
  }

  model(node) {
    return this.data.models[node.model];
  }

  modelConfig(node) {
    return this._modelService.config(this.model(node).existing);
  }

  nodeDisplay(node) {
    return (this._sketchService.isSelectedNode_or_all(node) || !this.selective);
  }

  paramDisplay(obj, param) {
    return 'display' in obj ? obj.display.includes(param) : true;
  }

  dblclick(node) {
    var model = this.model(node.model);
    var display: any = [];
    if (!model.display.includes('node')) {
      display = this.modelConfig(node).params.map(param => param.id)
      display.push('node');
      display.push('n');
      display.sort();
    }
    model.display = display;
  }

}
