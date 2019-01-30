import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { ColorService } from '../../services/color/color.service';
import { ConfigService } from '../../config/config.service';
import { ControllerService } from '../../controller/controller.service';
import { ChartService } from '../../chart/chart.service';
import { DataService } from '../../services/data/data.service';
import { SimulationService } from '../../simulation/simulation.service';
import { SketchService } from '../../sketch/sketch.service';

@Component({
  selector: 'app-node-controller',
  templateUrl: './node-controller.component.html',
  styleUrls: ['./node-controller.component.css'],
})
export class NodeControllerComponent implements OnInit, OnChanges {
  @Input() idx: any;
  public node: any;
  public color: any;
  public options: any = {};
  public configModel: any = {};
  public slider: any;
  public toggleColorPicker: any = false;

  constructor(
    public _colorService: ColorService,
    public _configService: ConfigService,
    public _controllerService: ControllerService,
    public _chartService: ChartService,
    public _dataService: DataService,
    public _simulationService: SimulationService,
    public _sketchService: SketchService,
  ) {
  }

  ngOnInit() {
    // console.log('Init node controller')
  }

  ngOnChanges() {
    // console.log('Update node controller')
    this.node = this._dataService.data.collections[this.idx];
    this.color = this._colorService.node(this.node);
    this.configModel = this._configService.config.nest.model[this.node.model];
    this.updateParams(this.node)
  }

  updateParams(node) {
    var params = {};
    this.configModel.params.forEach((param) => {
      params[param] = this.node.params[param] || this.configModel.options[param].value
    })
    node.params = params;
  }

  isRecorder(element_type) {
    return element_type == 'recorder'
  }

  selectModel(model) {
    this.node.model = model;
    this.node.params = {};
    this.configModel = this._configService.config.nest.model[this.node.model];
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
    var configModel = this._configService.config.nest.model[this.node.model];
    var data = this._dataService.data;
    this._dataService.data.collections[this.idx].params = {};
    configModel.params.forEach(d => {
      this._dataService.data.collections[this.idx].params[d] = configModel.options[d].value
    })
    this._dataService.history(this._dataService.data)
    if (!this._dataService.options.edit) {
      this._simulationService.run()
    }
  }

  freezeNode() {
    var data = this._dataService.data;
    if (data.collections[this.idx].params['frozen']) {
      data.collections[this.idx].params['frozen'] = false
    } else {
      data.collections[this.idx].params['frozen'] = true;
    }
  }

  deleteNode() {
    var data = this._dataService.data;
    this._dataService.history(data)

    var collections = data.collections.filter(d => d.idx != this.idx);
    collections.forEach((d, i) => {
      d.idx = i;
    })
    data.collections = collections;

    var connectomes = data.connectomes.filter(d => d.pre != this.idx && d.post != this.idx);
    if (connectomes.length != data.connectomes.length) {
      connectomes.forEach((d, i) => {
        d.idx = i;
        d.pre = d.pre > this.idx ? d.pre - 1 : d.pre;
        d.post = d.post > this.idx ? d.post - 1 : d.post;
      })
      data.connectomes = connectomes;
    }

    this._sketchService.update.emit()
    this._dataService.records = this._dataService.records.filter(d => d.recorder.idx != this.idx)
    if (!this._dataService.options.edit) {
      this._simulationService.run()
    }
  }

  onChange() {
    // console.log('Change value in node controller')
    this._dataService.history(this._dataService.data)
    this._simulationService.run()
  }

}
