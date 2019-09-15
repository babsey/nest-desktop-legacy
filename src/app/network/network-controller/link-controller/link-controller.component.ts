import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';

import { AppConfigService } from '../../../config/app-config/app-config.service';
import { ColorService } from '../../services/color.service';
import { NetworkConfigService } from '../../network-config/network-config.service';
import { ModelService } from '../../../model/model.service';
import { NetworkService } from '../../services/network.service';
import { NetworkSketchService } from '../../network-sketch/network-sketch.service';

import { Data } from '../../../classes/data';


@Component({
  selector: 'app-link-controller',
  templateUrl: './link-controller.component.html',
  styleUrls: ['./link-controller.component.scss'],
})
export class LinkControllerComponent implements OnInit, OnChanges {
  @Input() data: Data;
  @Input() idx: number;
  @Output() linkChange: EventEmitter<any> = new EventEmitter();
  @Output() connectomeChange: EventEmitter<any> = new EventEmitter();
  public connOptions: any[] = [];
  public connRules: any[] = [];
  public link: any = {};
  public options: any;
  public postColor: string;
  public preColor: string;
  public selection: boolean = false;
  public slider: any = {};
  public synModel: any;
  public synModels: any[] = [];
  public backgroundImage: string = '';

  constructor(
    private _appConfigService: AppConfigService,
    private _modelService: ModelService,
    private _networkService: NetworkService,
    private _networkSketchService: NetworkSketchService,
    public _colorService: ColorService,
    public _networkConfigService: NetworkConfigService,
  ) { }

  ngOnInit() {
    this.update()
  }

  ngOnChanges() {
    this.update()
  }

  advanced() {
    return this._appConfigService.config['app'].level == 'advanced';
  }

  update() {
    // console.log('Update link controller')
    if (this.idx == undefined) return
    this.link = this.data.app.links[this.idx];
    let connectome = this.connectome();
    let nodes = this.data.app.nodes;
    this.preColor = this._colorService.node(nodes[connectome.pre]);
    this.postColor = this._colorService.node(nodes[connectome.post]);
    var bgColor = 'white';
    this.backgroundImage = this.advanced() ? '' : 'linear-gradient(' + ['90deg', this.preColor, this.preColor, this.preColor, bgColor, bgColor, bgColor, bgColor, bgColor, this.postColor, this.postColor, this.postColor].join(', ') + ')';

    if (!this.isBothSpatial()) {
      var connectionConfig = this._networkConfigService.config.connection;
      this.connRules = connectionConfig.specs.map(spec => { return { value: spec.rule, label: spec.label } });
      var connRule = connectome.hasOwnProperty('conn_spec') ? connectome.conn_spec.rule || 'all_to_all' : 'all_to_all';
      this.slider.connection = connectionConfig.specs.find(spec => spec.rule == connRule).params || [];

      var synapses = this._modelService.list('synapse');
      this.synModels = synapses.map(synapse => { return { value: synapse, label: this._modelService.config(synapse).label } });
      var synModel = connectome.hasOwnProperty('syn_spec') ? connectome.syn_spec.model || 'static_synapse' : 'static_synapse';
      this.synModel = this._modelService.config(synModel);
      this.slider.synapse = this.synModel['params'] || [];
    }
  }

  collection(idx) {
    return this.data.simulation.collections[idx];
  }

  connectome(idx = this.idx) {
    return this.data.simulation.connectomes[idx];
  }

  source() {
    var connectome = this.data.simulation.connectomes[this.idx];
    return this.data.app.nodes[connectome.pre];
  }

  target() {
    var connectome = this.data.simulation.connectomes[this.idx];
    return this.data.app.nodes[connectome.post];
  }

  isSpatial(idx) {
    var collection = this.collection(idx);
    return collection.hasOwnProperty('spatial');
  }

  keys(dict) {
    return Object.keys(dict)
  }

  selectedConnRule() {
    var connectome = this.connectome();
    if (connectome.hasOwnProperty('conn_spec')) {
      return connectome.conn_spec.rule || 'all_to_all';
    }
    return 'all_to_all';
  }

  selectedSynModel() {
    var connectome = this.connectome();
    if (connectome.hasOwnProperty('syn_spec')) {
      return connectome.syn_spec.model || 'static_synapse';
    }
    return 'static_synapse';
  }

  deleteLink() {
    this.data.simulation.connectomes = this.data.simulation.connectomes.filter((connectome, idx) => idx != this.idx);
    this.data.app.links = this.data.app.links.filter(link => link.idx != this.idx);
    this.data.app.links.forEach((link, idx) => link.idx = idx)
    this._networkSketchService.update.emit()
    this.connectomeChange.emit(this.data)
  }

  linkDisplay() {
    return this._networkService.isLinkSelected(this.link, this.data) ? '' : 'none';
  }

  paramDisplay(param) {
    return this.link.hasOwnProperty('display') ? this.link.display.includes(param) : true;
  }

  isBothSpatial() {
    var connectome = this.data.simulation.connectomes[this.idx];
    var pre = this.data.simulation.collections[connectome.pre];
    var post = this.data.simulation.collections[connectome.post];
    return pre.hasOwnProperty('spatial') && post.hasOwnProperty('spatial');
  }

  onConnChange(id, value) {
    // console.log('Change value in link controller')
    var connectome = this.connectome();
    if (!connectome.hasOwnProperty('conn_spec')) {
      connectome['conn_spec'] = {};
    }
    connectome.conn_spec[id] = value;
    this._networkSketchService.update.emit()
    this.connectomeChange.emit(this.data)
  }

  onSynChange(id, value) {
    // console.log('Change value in link controller')
    var connectome = this.connectome();
    if (!connectome.hasOwnProperty('syn_spec')) {
      connectome['syn_spec'] = {};
    }
    connectome.syn_spec[id] = value;
    this._networkSketchService.update.emit()
    this.connectomeChange.emit(this.data)
  }

  onSelectConnRule(rule) {
    let connectome = this.connectome();
    connectome.conn_spec = {}
    connectome.conn_spec.rule = rule;
    this.link.display = ['conn_spec.rule', 'syn_spec.model', 'syn_spec.weight', 'syn_spec.delay'];
    var conn_spec = this._networkConfigService.config.connection.specs.find(conn_spec => conn_spec.rule == rule);
    if (conn_spec.hasOwnProperty('params')) {
      conn_spec.params.map(param => {
        connectome.conn_spec[param.id] = param.value;
        this.link.display.push('conn_spec.' + param.id);
      })
    }
    this.update()
    this.connectomeChange.emit(this.data)
  }

  onSelectSynModel(model) {
    this.connectome().syn_spec.model = model;
    this.update()
    this.connectomeChange.emit(this.data)
  }

  onSelectConnectionType(value) {
    this.connectome().projections['connection_type'] = value;
    this.update()
    this.connectomeChange.emit(this.data)
  }

  onProjectionsValueChange(id, value) {
    let connectome = this.connectome()
    // if (id == 'number_of_connections') {
    //   delete connectome.projections['kernel']
    // }
    // if (id == 'kernel') {
    //   delete connectome.projections['number_of_connections'];
    // }
    connectome.projections[id] = value;
    this.connectomeChange.emit(this.data)
  }

  onProjectionSelectionChange(event) {
    this.connectome().projections[event.option.value] = event.option.selected;
    this.connectomeChange.emit(this.data)
  }

  onMaskChange() {
    this.connectomeChange.emit(this.data)
  }
}
