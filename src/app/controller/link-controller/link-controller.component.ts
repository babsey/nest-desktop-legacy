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
  public connOptions: any[] = [];
  public connRules: any[] = [];
  public pre: any;
  public preColor: string;
  public post: any;
  public postColor: string;
  public link: any;
  public options: any;
  public selectionList: boolean = false;
  public slider: any = {};
  public synModel: any;
  public synModels: any[] = [];
  public projectionsConfig = {
    'connection_type': [
      {'value': 'divergent', 'label': 'divergent',},
      {'value': 'convergent', 'label': 'convergent'},
    ],
    'kernel': {
      'label': 'kernel',
      'input': 'valueSlider',
      'value': '',
      'min': 0.0,
      'max': 1.0,
      'step': 0.01,
    },
    'weights': {
      'label': 'weights',
      'input': 'valueSlider',
      'value': 1.0,
      'min': -10.0,
      'max': 10.0,
      'step': 0.1,
      'unit': 'pA',
    },
    'delays': {
      'label': 'delays',
      'input': 'valueSlider',
      'value': 1.0,
      'min': 0.0,
      'max': 10.0,
      'step': 0.1,
      'unit': 'ms',
    },
    'number_of_connections': {
      'label': 'number of connections',
      'input': 'valueSlider',
      'value': '',
      'min': 0,
      'max': 1000,
      'step': 1,
    },
    'allow_autapses': {
      'label': 'allow autapses'
    },
    'allow_multapses': {
      'label': 'allow multapses'
    },
  }


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
    this.pre = this._dataService.data.collections[this.link.pre];
    this.post = this._dataService.data.collections[this.link.post];
    this.preColor = this._colorService.node(this.pre);
    this.postColor = this._colorService.node(this.post);

    if (this.isBothLayer()) {
      if (this.link.display == undefined) {
        this.link.display = ['connection_type', 'kernel', 'number_of_connections', 'mask', 'weights', 'delays', 'allow_autapses', 'allow_multapses'];
      }
    } else  {
      var connectionConfig = this._controllerConfigService.config.connection;
      this.connRules = connectionConfig.specs.map(spec => { return { value: spec.rule, label: spec.label } });
      var connRule = this.link.conn_spec ? this.link.conn_spec.rule : 'all_to_all';
      this.slider.connection = connectionConfig.specs.find(spec => spec.rule == connRule).params || [];

      var synapses = this._modelService.list('synapse');
      this.synModels = synapses.map(synapse => { return { value: synapse, label: this._modelService.config(synapse).label } });
      var synModel = this.link.syn_spec.hasOwnProperty('model') ? this.link.syn_spec.model : "static_synapse";
      this.synModel = this._modelService.config(synModel);
      this.slider.synapse = this.synModel['params'] || [];

      if (this.link.display == undefined) {
        this.link.display = ['conn_spec.rule', 'syn_spec.model', 'syn_spec.weight', 'syn_spec.delay'];
        if (connectionConfig.hasOwnProperty('params')) {
          connectionConfig.params.map(param => {
            this.link.display.push(param.id);
          })
        }
      }
    }
  }

  keys(dict) {
    return Object.keys(dict)
  }

  selectNode(node) {
    this._controllerService.selected = null;
    this._sketchService.selectNode(node)
  }

  selectLink() {
    this._controllerService.selected = null;
    this._sketchService.selectLink(this.link)
  }

  onSelectConnRule(rule) {
    this.link.conn_spec = {}
    this.link.conn_spec.rule = rule;
    this.link.display = ['conn_spec.rule', 'syn_spec.model', 'syn_spec.weight', 'syn_spec.delay'];
    var conn_spec = this._controllerConfigService.config.connection.specs.find(conn_spec => conn_spec.rule == rule);
    if (conn_spec.hasOwnProperty('params')) {
      conn_spec.params.map(param => {
        this.link.conn_spec[param.id] = param.value;
        this.link.display.push(param.id);
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

  linkDisplay() {
    return this._sketchService.isSelectedLink_or_all(this.link) ? '' : 'none';
  }

  paramDisplay(param) {
    var display = 'display' in this.link ? this.link.display.includes(param) : true;
    return display ? '' : 'none'
  }

  isBothLayer() {
    return this._dataService.isBothLayer(this.link, this._dataService.data.collections);
  }

  onSelectConnectionType(value) {
    this.link.projections['connection_type'] = value;
    this.update()
    this.linkChange.emit()
  }

  onProjectionsValueChange(id, value) {
    if (id == 'number_of_connections') {
      delete this.link.projections['kernel']
    }
    if (id == 'kernel') {
      delete this.link.projections['number_of_connections'];
    }
    this.link.projections[id] = value;
    this.linkChange.emit()
  }

  onProjectionSelectionChange(event) {
    this.link.projections[event.option.value] = event.option.selected;
    this.linkChange.emit()
  }
}
