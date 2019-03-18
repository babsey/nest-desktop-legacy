import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';

import { ColorService } from '../../services/color/color.service';
import { ModelService } from '../../model/model.service';
import { ControllerConfigService } from '../../config/controller-config/controller-config.service';
import { ControllerService } from '../../controller/controller.service';
import { ChartService } from '../../chart/chart.service';
import { DataService } from '../../services/data/data.service';
import { SketchService } from '../../sketch/sketch.service';

@Component({
  selector: 'app-node-controller',
  templateUrl: './node-controller.component.html',
  styleUrls: ['./node-controller.component.css'],
})
export class NodeControllerComponent implements OnInit, OnChanges {
  @Input() idx: number;
  @Output() nodeChange = new EventEmitter();
  public node: any;
  public color: string;
  public options: any = {};
  public configModel: any = {};
  public toggleColorPicker: boolean = false;
  public models: any[] = [];

  constructor(
    private _modelService: ModelService,
    public _colorService: ColorService,
    public _controllerConfigService: ControllerConfigService,
    public _controllerService: ControllerService,
    public _chartService: ChartService,
    public _dataService: DataService,
    public _sketchService: SketchService,
  ) {
  }

  ngOnInit() {
    // console.log('Init node controller')
  }

  ngOnChanges() {
    // console.log('Update node controller')
    this.node = this._dataService.data.collections[this.idx];
    var models = this._modelService.list(this.node.element_type);
    this.models = models.map(model => {return {value: model, label: this._modelService.config(model).label}});
    this.color = this._colorService.node(this.node);
    this.configModel = this._modelService.config(this.node.model);
    this.updateParams(this.node)
  }

  updateParams(node) {
    var params = {};
    this.configModel.params.forEach(param => {
      params[param.id] = this.node.params[param.id] || param.value;
    })
    node.params = params;
  }

  isRecorder(element_type) {
    return element_type == 'recorder'
  }

  toggleSelectNode(node) {
    this._controllerService.selected = null;
    this._sketchService.toggleSelectNode(node)
  }

  selectModel(model) {
    this.node.model = model;
    this.node.params = {};
    this.configModel = this._modelService.config(this.node.model);
    this.updateParams(this.node)
  }

  selectColor(color) {
    if (color == 'none') {
      delete this.node['color'];
      this.color = this._colorService.node(this.node);
    } else {
      this.color = color;
      this.node['color'] = color;
    }
    this._sketchService.update.emit()
    this._chartService.init.emit()
  }

  resetNode() {
    var data = this._dataService.data;
    this._dataService.data.collections[this.idx].params = {};
    this.configModel.params.forEach(param => {
      this._dataService.data.collections[this.idx].params[param.id] = param.value
    })
    this._dataService.history(this._dataService.data)
    this.nodeChange.emit()
  }

  freezeNode() {
    var data = this._dataService.data;
    if (data.collections[this.idx].params['frozen']) {
      data.collections[this.idx].params['frozen'] = false
    } else {
      data.collections[this.idx].params['frozen'] = true;
    }
    this.nodeChange.emit()
  }

  deleteNode() {
    this._dataService.deleteNode(this.idx)
    this._sketchService.update.emit()
    this._dataService.records = this._dataService.records.filter(d => d.recorder.idx != this.idx)
    this.nodeChange.emit()
  }

  onChange() {
    // console.log('Change value in node controller')
    this._dataService.history(this._dataService.data)
    this.nodeChange.emit()
  }

  nodeDisplay(node) {
    var display = 'display' in node ? node.display.includes('node') : true;
    return this._sketchService.isSelectedNode_or_all(node) && display;
  }

  paramDisplay(node, param) {
    if (this._controllerConfigService.config.level > 0) {
      var level = this.configModel.params.find(d => d.id == param).level;
      var display:any = level <= this._controllerConfigService.config.level;
    } else {
      var display:any = 'display' in node ? node.display.includes(param) : true;
    }
    return display;
  }

}
