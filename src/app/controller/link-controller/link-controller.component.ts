import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';

import { ColorService } from '../../services/color/color.service';
import { ControllerConfigService } from '../../config/controller-config/controller-config.service';
import { ModelService } from '../../model/model.service';
import { ControllerService } from '../../controller/controller.service';
import { DataService } from '../../services/data/data.service';
import { SketchService } from '../../sketch/sketch.service';


@Component({
  selector: 'app-link-controller',
  templateUrl: './link-controller.component.html',
  styleUrls: ['./link-controller.component.css'],
})
export class LinkControllerComponent implements OnInit, OnChanges {
  @Input() idx: number;
  @Output() linkChange = new EventEmitter();
  public data: any;
  public link: any;
  public colors: any = {};
  public slider: any = {};
  public options: any;
  public synModel: any;
  public connOptions: any[] = [];
  public connRules: any[] = [];
  public synModels: any[] = [];

  constructor(
    private _modelService: ModelService,
    private _controllerConfigService: ControllerConfigService,
    public _colorService: ColorService,
    public _controllerService: ControllerService,
    public _dataService: DataService,
    public _sketchService: SketchService,
  ) { }

  ngOnInit() {
    this.update()
  }

  ngOnChanges() {
    this.update()
  }

  update() {
    this.link = this._dataService.data.connectomes[this.idx];
    this.colors = {
      pre: this._colorService.nodeIdx(this.link.pre),
      post: this._colorService.nodeIdx(this.link.post),
      weight: this._colorService.link(this),
    };
    var connectionConfig = this._controllerConfigService.config.connection;
    this.connRules = connectionConfig.specs.map(spec => { return { value: spec.rule, label: spec.label } });
    var connRule = this.link.conn_spec ? this.link.conn_spec.rule : 'all_to_all';
    this.slider.connection = connectionConfig.specs.find(spec => spec.rule == connRule).params || [];

    var synapses = this._modelService.list('synapse')
    this.synModels = synapses.map(synapse => { return { value: synapse, label: this._modelService.config(synapse).label } });
    var synModel = 'model' in this.link.syn_spec ? this.link.syn_spec.model : "static_synapse";
    this.synModel = this._modelService.config(synModel);
    this.slider.synapse = this.synModel.params || [];
  }

  keys(dict) {
    return Object.keys(dict)
  }

  toggleSelectNode(node) {
    this._controllerService.selected = null;
    this._sketchService.toggleSelectNode(node)
  }

  toggleSelectLink(link) {
    this._controllerService.selected = null;
    this._sketchService.toggleSelectLink(link)
  }

  onSelectConnRule(rule) {
    this.link.conn_spec = {}
    this.link.conn_spec.rule = rule;
    var conn_spec = this._controllerConfigService.config.connection.specs.find(conn_spec => conn_spec.rule == rule);
    if ('params' in conn_spec) {
      conn_spec.params.map(param => {
        this.link.conn_spec[param.id] = param.value;
      })
    }
    this.update()
    this.linkChange.emit()
  }

  onSelectSynModel(model) {
    this.link.syn_spec.model = model;
    this.update()
    this.linkChange.emit()
  }

  onChange() {
    // console.log('Change value in link controller')
    this.update()
    this._sketchService.update.emit()
    this._dataService.history(this._dataService.data)
    this.linkChange.emit()
  }

  deleteLink() {
    this._dataService.deleteLink(this.idx)
    this._sketchService.update.emit()
    this._dataService.records = this._dataService.records.filter(d => d.recorder.idx != this.idx)
    this.linkChange.emit()
  }

  linkDisplay(link) {
    var display = 'display' in link ? link.display.includes('link') : true;
    return this._sketchService.isSelectedLink_or_all(link) && display ? '' : 'none'
  }

  paramDisplay(link, param) {
    var display = 'display' in link ? link.display.includes(param) : true;
    return display ? '' : 'none'
  }
}
