import { Component, Input, OnInit, OnChanges, OnDestroy, Output, EventEmitter } from '@angular/core';

import { ColorService } from '../../services/color/color.service';
import { ModelService } from '../../model/model.service';
import { ControllerConfigService } from '../../config/controller-config/controller-config.service';
import { ControllerService } from '../../controller/controller.service';
import { DataService } from '../../services/data/data.service';
import { SketchService } from '../../sketch/sketch.service';

@Component({
  selector: 'app-node-controller',
  templateUrl: './node-controller.component.html',
  styleUrls: ['./node-controller.component.css'],
})
export class NodeControllerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() idx: number;
  @Output() nodeChange = new EventEmitter();
  public record_from = [];
  public recordables: string[] = [];
  public color: string;
  public configModel: any = {};
  public linkedNode: any = null;
  public model: any = {};
  public models: any[] = [];
  public node: any = {};
  public nodes: any = [];
  public options: any = {};
  public selectionList: boolean = false;
  private subscription: any;
  public toggleColorPicker: boolean = false;
  public topologyOptions: any = {
    "extent": {
      "label": "extent",
      "value": [1,1],
    },
    "center": {
      "label": "center",
      "value": [0,0],
    },
    "rows": {
      "label": "rows",
      "value": 1,
      "min": 1,
      "max": 10,
      "step": 1
    },
    "columns": {
      "label": "columns",
      "value": 1,
      "min": 1,
      "max": 10,
      "step": 1
    },
    "positions": {
      "label": "positions",
      "value": [],
    },
  };

  constructor(
    private _modelService: ModelService,
    public _colorService: ColorService,
    public _controllerConfigService: ControllerConfigService,
    public _controllerService: ControllerService,
    public _dataService: DataService,
    public _sketchService: SketchService,
  ) {
  }

  ngOnInit() {
    // console.log('Init node controller')
    this.subscription = this._sketchService.update.subscribe(() => this.updateRecordFrom())
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  ngOnChanges() {
    // console.log('Update node controller')
    this.node = this._dataService.data.collections[this.idx];
    this.nodes = this._dataService.data.collections.filter(node => node.element_type == this.node.element_type && node != this.node);
    this.model = this._dataService.data.models[this.node.model];
    this.updateParams()
    var models = this._modelService.list(this.node.element_type);
    this.models = models.map(model => { return { value: model, label: this._modelService.config(model).label } });
    this.color = this._colorService.node(this.node);
    this.linkModel(this.node.model, false)
  }

  setLevel(level) {
    this.model.display = [];
    this.configModel.params.map(param => {
      if (param.level <= level) {
        this.model.display.push(param.id)
      }
    })
  }

  updateParams() {
    this.configModel = this._modelService.config(this.model.existing);
    this.configModel.params.forEach(param => {
      if (!(param.id in this.model.params)) {
        this.model.params[param.id] = param.value;
      }
    })
    this.node.display = this.node.display || ['n'];
    if (this.model.display == undefined) {
      this.model.display = [];
      this.configModel.params.map(param => this.model.display.push(param.id));
    }
    this.updateRecordFrom()
  }

  updateRecordFrom() {
    if (this.model.existing != 'multimeter') return
    let recordedNeurons = this._dataService.data.connectomes.filter(link => link.pre == this.idx)
    if (recordedNeurons.length > 0) {
      let recordedNeuron = this._dataService.data.collections[recordedNeurons[0].post];
      this.recordables = this._modelService.config(this._dataService.data.models[recordedNeuron.model].existing).recordables || [];
      if (this.model.params.hasOwnProperty('record_from')) {
        this.record_from = this.model.params['record_from'];
      } else {
        this.record_from = this.recordables.includes('V_m') ? ['V_m'] : [];
        this.model.params['record_from'] = this.record_from;
      }
    }
  }

  isRecorder() {
    return this.node.element_type == 'recorder';
  }

  isSelected() {
    return this._sketchService.isSelectedNode_or_all(this.node);
  }

  selectNode(node) {
    this._controllerService.selected = null;
    this._sketchService.selectNode(node);
  }

  selectModel(model) {
    if (this.node.element_type == 'recorder') {
      this._dataService.records = [];
    }
    this.model['existing'] = model;
    delete this.model.display;
    this.model.params = {};
    this.updateParams();
    this._dataService.validate()
    this.nodeChange.emit()
  }

  selectColor(color) {
    if (color == 'none') {
      delete this.node['color'];
      this.color = this._colorService.node(this.node);
    } else {
      this.color = color;
      this.node['color'] = color;
    }
    this.nodeChange.emit()
  }

  linkModel(model, changeEmit=true) {
    this.node.model = model;
    let modelIdx = parseInt(this.node.model.split('-')[1]);
    if (modelIdx == this.node.idx) {
      this.linkedNode = null;
    } else {
      this.linkedNode = this._dataService.data.collections[modelIdx];
    }
    if (changeEmit) {
      this.nodeChange.emit()
    }
  }

  resetParameters() {
    this._dataService.history(this._dataService.data)
    this.model.params = {};
    this.configModel.params.forEach(param => {
      this.model.params[param.id] = param.value
    })
    this.nodeChange.emit()
  }

  deleteNode() {
    this._dataService.deleteNode(this.idx)
    this._dataService.records = this._dataService.records.filter(d => d.recorder.idx != this.idx)
    this.nodeChange.emit()
  }

  onChange() {
    // console.log('Change value in node controller')
    this._dataService.history(this._dataService.data)
    this.nodeChange.emit()
  }

  nodeDisplay(node) {
    return this._sketchService.isSelectedNode_or_all(node);
  }

  paramDisplay(obj, param) {
    return 'display' in obj ? obj.display.includes(param) : true;
  }

  isLayer() {
    return this.node.hasOwnProperty('topology')
  }

  topologyEvent(event) {
    if (event.option.value == 'topology') {
      if (event.option.selected) {
        this.node.topology = {
          'edge_wrap': false,
          'rows': 1,
          'columns': 1,
          'positions': [],
          'extent': [1,1],
          'center': [0,0]
        };
      } else {
        delete this.node.topology;
      }
      this._dataService.data = this._dataService.clean(this._dataService.data);
    } else if (event.option.value == 'edge_wrap') {
      this.node.topology.edge_wrap = event.option.selected;
    }
    this.nodeChange.emit()
  }

  onTopoChange(param, value) {
    // console.log('Change value in node controller')
    this._dataService.history(this._dataService.data)
    this.node.topology[param] = value;
    if (['extent', 'center', 'rows', 'columns'].includes(param)) {
      this.node.topology.positions = []
    }
    this.nodeChange.emit()
  }

  onRecordChange() {
    this._dataService.records = [];
    this.model.params['record_from'] = this.record_from;
  }

}
