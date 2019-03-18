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
  @Input() nodes: any[] = [];
  @Input() editing: boolean = false;
  @Input() selective: boolean = false;
  @Input() slide: boolean = false;

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

  label(node) {
    let config = this._modelService.config(node.model);
    return config.label;
  }

  params(node) {
    return this._modelService.config(node.model).params;
  }

  nodeDisplay(node) {
    var display = 'display' in node ? node.display.includes('node') : true;
    return (this._sketchService.isSelectedNode_or_all(node) || !this.selective) && display ? '' : 'none';
  }

  paramDisplay(node, param) {
    var display = 'display' in node ? node.display.includes(param) : true;
    return display ? '' : 'none';
  }

  dblclick(node) {
    if (node.display.includes('node')) {
      node.display = [];
    } else {
      var display = this.params(node).map(param => param.id)
      display.sort();
      display = ['node'].concat(display);
      node.display = display;
    }
  }

  onChange() {
    if (!this._dataService.options.edit) {
      this._networkSimulationService.run()
    }
  }

  paramReset(node, param) {
    if (this.slide) {
      node.params[param.id] = param.value;
      this.onChange()
    }
  }

}
