import { Component, Input, OnInit, OnChanges, OnDestroy, Output, EventEmitter } from '@angular/core';


import { AppConfigService } from '../../../config/app-config/app-config.service';
import { ColorService } from '../../services/color.service';
import { ModelService } from '../../../model/model.service';
import { NetworkConfigService } from '../../network-config/network-config.service';
import { NetworkControllerService } from '../network-controller.service';
import { NetworkService } from '../../services/network.service';
import { NetworkSketchService } from '../../network-sketch/network-sketch.service';

import { Data } from '../../../classes/data';


@Component({
  selector: 'app-node-controller',
  templateUrl: './node-controller.component.html',
  styleUrls: ['./node-controller.component.scss'],
})
export class NodeControllerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: Data;
  @Input() idx: number;
  @Output() nodeChange: EventEmitter<any> = new EventEmitter();
  @Output() collectionChange: EventEmitter<any> = new EventEmitter();
  private subscription: any;
  public collections: any = [];
  public color: string;
  public configModel: any = {};
  public linkedNode: any = null;
  public model: any = {};
  public models: any[] = [];
  public node: any = {};
  public nodes: any = [];
  public options: any = {};
  public record_from = [];
  public recordables: string[] = [];
  public toggleColorPicker: boolean = false;
  public selection: boolean = false;

  constructor(
    private _appConfigService: AppConfigService,
    private _modelService: ModelService,
    private _networkControllerService: NetworkControllerService,
    public _colorService: ColorService,
    public _networkConfigService: NetworkConfigService,
    private _networkService: NetworkService,
    private _networkSketchService: NetworkSketchService,
  ) {
  }

  ngOnInit() {
    // console.log('Init node controller')
    this.subscription = this._networkSketchService.update.subscribe(() => this.updateRecordFrom())
    this.update()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  ngOnChanges() {
    // console.log('Update node controller')
    // this.update()
  }

  advanced() {
    return this._appConfigService.config['app'].advanced;
  }

  update() {
    if (this.idx == undefined) return
    this.node = this.data.app.nodes[this.idx];
    this.nodes = this.data.app.nodes.filter(node => this.collection(node.idx).element_type == this.collection().element_type && node != this.node);
    this.collections = this.nodes.map(node => this.collection(node.idx))
    this.model = this.collection().model;
    this.updateParams()
    var models = this._modelService.list(this.collection().element_type);
    this.models = models.map(model => { return { value: model, label: this._modelService.config(model).label } });
    this.color = this._colorService.node(this.node);
    this.linkModel(this.model, false)
  }

  collection(idx = this.idx) {
    return this.data.simulation.collections[idx];
  }

  setLevel(level) {
    var model = this.data.app.models[this.model];
    model.display = [];
    this.configModel.params.map(param => {
      if (param.level <= level) {
        model.display.push(param.id)
      }
    })
  }

  updateParams() {
    var simModel = this.data.simulation.models[this.model];
    this.configModel = this._modelService.config(simModel.existing);
    this.configModel.params.forEach(param => {
      if (!(param.id in simModel.params)) {
        simModel.params[param.id] = param.value;
      }
    })
    this.node.display = this.node.display || ['n'];
    this.updateRecordFrom()
  }

  updateRecordFrom() {
    if (!this.data.simulation.models.hasOwnProperty(this.model)) return
    var model = this.data.simulation.models[this.model];
    if (model.existing != 'multimeter') return
    let recordedNeurons = this.data.simulation.connectomes.filter(connectome => connectome.pre == this.idx)
    if (recordedNeurons.length > 0) {
      let recordedNeuron = this.collection(recordedNeurons[0].post);
      this.recordables = this._modelService.config(this.data.simulation.models[recordedNeuron.model].existing).recordables || [];
      if (model.params.hasOwnProperty('record_from')) {
        this.record_from = model.params['record_from'];
      } else {
        this.record_from = this.recordables.includes('V_m') ? ['V_m'] : [];
        model.params['record_from'] = this.record_from;
      }
    }
  }

  isRecorder() {
    return this.collection().element_type == 'recorder';
  }

  nodeDisplay() {
    return this._networkService.isNodeSelected(this.node, this.data) ? '' : 'none';
  }

  selectNode(node) {
    this._networkService.selectNode(node, this.collection(this.idx).element_type);
  }

  selectColor(color) {
    if (color == 'none') {
      delete this.node['color'];
      this.color = this._colorService.node(this.node);
    } else {
      this.color = color;
      this.node['color'] = color;
    }
    this.nodeChange.emit(this.data)
  }

  linkModel(model, changeEmit = true) {
    var collection = this.collection();
    collection.model = model;
    let modelIdx = parseInt(model.split('-')[1]);
    if (modelIdx == this.idx) {
      this.linkedNode = null;
    } else {
      this.linkedNode = this.collection(modelIdx);
    }
    if (changeEmit) {
      this.collectionChange.emit(this.data)
    }
  }

  resetParameters() {
    var simModel = this.data.simulation.models[this.model];
    simModel.params = {};
    this.configModel.params.forEach(param => {
      simModel.params[param.id] = param.value
    })
    this.collectionChange.emit(this.data)
  }

  deleteNode() {
    this.data.app.nodes = this.data.app.nodes.filter((node, idx) => idx != this.idx);
    this.data.simulation.collections = this.data.simulation.collections.filter((node, idx) => idx != this.idx);
    this.data.app.nodes.forEach((node, idx) => node.idx = idx)

    var links = this.data.app.links.filter(link => {
      var connectome = this.data.simulation.connectomes[link.idx];
      return connectome.pre != this.idx && connectome.post != this.idx;
    });
    if (links.length != this.data.simulation.connectomes.length) {
      links.forEach((link, idx) => link.idx = idx)
      this.data.app.links = links;
      var connectomes = this.data.simulation.connectomes.filter(connectome => connectome.pre != this.idx && connectome.post != this.idx);
      connectomes.forEach(connectome => {
        connectome.pre = connectome.pre > this.idx ? connectome.pre - 1 : connectome.pre;
        connectome.post = connectome.post > this.idx ? connectome.post - 1 : connectome.post;
      })
      this.data.simulation.connectomes = connectomes;
    }

    this.collectionChange.emit(this.data)
  }

  paramDisplay(obj, param) {
    if (obj == undefined) return
    return obj.hasOwnProperty('display') ? obj.display.includes(param) : true;
  }

  isSpatial() {
    return this.collection().hasOwnProperty('spatial')
  }

  selectModel(event) {
    var model = event.value;
    var simModel = this.data.simulation.models[this.model];
    simModel['existing'] = model;
    delete this.data.app.models[this.model].display;
    simModel.params = {};
    this.updateParams();
    this.collectionChange.emit(this.data)
    // this.nodeChange.emit(this.data)
  }

  onNodeChange(value) {
    // console.log('Change input value in node controller')
    var collection = this.collection();
    collection.n = value;
    this.collectionChange.emit(this.data)
  }

  onParamChange(id, value) {
    // console.log('Change param value in node controller')
    this.data.simulation.models[this.model].params[id] = value;
    this.collectionChange.emit(this.data)
  }

  onSpatialChange(value) {
    // console.log('Change param value in node controller')
    this.collectionChange.emit(this.data)
  }

  onRecordChange() {
    var model = this.data.simulation.models[this.model];
    model.params['record_from'] = this.record_from;
    this.collectionChange.emit(this.data)
  }

}
