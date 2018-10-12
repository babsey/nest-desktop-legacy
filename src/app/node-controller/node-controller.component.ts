import { Component, Input, OnInit, OnChanges } from '@angular/core';


import { DataService } from '../shared/services/data/data.service';
import { ControllerService } from '../shared/services/controller/controller.service';
import { SketchService } from '../shared/services/sketch/sketch.service';
import { ConfigService } from '../shared/services/config/config.service';

import { faEllipsisV, faCrosshairs, faEraser, faBan, faMinusCircle } from '@fortawesome/free-solid-svg-icons';


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
  public services: any = {};

  public faEllipsisV = faEllipsisV;
  public faCrosshairs = faCrosshairs;
  public faEraser = faEraser;
  public faBan = faBan;
  public faMinusCircle = faMinusCircle;


  constructor(
    public _dataService: DataService,
    public _controllerService: ControllerService,
    public _sketchService: SketchService,
    public _configService: ConfigService,
  ) {
    this.services = {
      data: _dataService,
      controller: _controllerService,
      sketch: _sketchService,
      config: _configService,
    };
    this.options = {
      controller: _controllerService.options,
      sketch: _sketchService.options,
      node: _configService.config.node,
    }
  }

  ngOnInit() {
  }

  updateParams(node) {
    var params = {};
    this.configModel.params.map((param) => {
      params[param] = this.node.params[param] || this.configModel.options[param].value
    })
    node.params = params;
  }

  ngOnChanges() {
    this.node = this._dataService.data.collections[this.idx];
    var colors = this._sketchService.options.nodes.colors;
    this.color = colors[this.node.idx % colors.length];
    this.configModel = this._configService.config.nest.model[this.node.model];
    this.updateParams(this.node)
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

}
