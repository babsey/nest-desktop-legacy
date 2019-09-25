import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';

import { AppConfigService } from '../../../config/app-config/app-config.service';
import { ColorService } from '../../services/color.service';
import { ModelService } from '../../../model/model.service';
import { NetworkConfigService } from '../../network-config/network-config.service';
import { NetworkService } from '../../services/network.service';
import { NetworkSketchService } from '../../network-sketch/network-sketch.service';

import { Data } from '../../../classes/data';


@Component({
  selector: 'app-link-selection',
  templateUrl: './link-selection.component.html',
  styleUrls: ['./link-selection.component.scss'],
})
export class LinkSelectionComponent implements OnInit, OnChanges {
  @Input() data: Data;
  @Input() idx: number;
  @Output() linkChange: EventEmitter<any> = new EventEmitter();
  public connOptions: any[] = [];
  public connRules: any[] = [];
  public link: any = {};
  public connectome: any = {};
  public options: any;
  public postColor: string;
  public preColor: string;
  public slider: any = {};
  public synModel: any;
  public synModels: any[] = [];
  public backgroundImage: string;

  constructor(
    private _appConfigService: AppConfigService,
    private _modelService: ModelService,
    private _networkConfigService: NetworkConfigService,
    private _networkService: NetworkService,
    private _networkSketchService: NetworkSketchService,
    public _colorService: ColorService,
  ) { }

  ngOnInit() {
    // this.update()
  }

  ngOnChanges() {
    // console.log('Update link selection')
    this.update()
  }

  advanced() {
    return this._appConfigService.config['app'].advanced;
  }

  update() {
    if (this.idx == undefined) return

    this.link = this.data.app.links[this.idx];
    this.connectome = this.data.simulation.connectomes[this.idx];
    let nodes = this.data.app.nodes;
    this.preColor = this._colorService.node(nodes[this.connectome.pre]);
    this.postColor = this._colorService.node(nodes[this.connectome.post]);
    var bgColor = 'white';
    this.backgroundImage = this.advanced() ? '' : 'linear-gradient(' + ['90deg', this.preColor, this.preColor, this.preColor, bgColor, bgColor, bgColor, bgColor, bgColor, this.postColor, this.postColor, this.postColor].join(', ') + ')';

    if (!this.isBothSpatial()) {
      var connectionConfig = this._networkConfigService.config.connection;
      this.connRules = connectionConfig.specs.map(spec => { return { value: spec.rule, label: spec.label } });
      var connRule = this.connectome.hasOwnProperty('conn_spec') ? this.connectome.conn_spec.rule || 'all_to_all' : 'all_to_all';
      this.slider.connection = connectionConfig.specs.find(spec => spec.rule == connRule).params || [];

      var synapses = this._modelService.list('synapse');
      this.synModels = synapses.map(synapse => { return { value: synapse, label: this._modelService.config(synapse).label } });
      var synModel = this.connectome.hasOwnProperty('syn_spec') ? this.connectome.syn_spec.model || 'static_synapse' : 'static_synapse';
      this.synModel = this._modelService.config(synModel);
      this.slider.synapse = this.synModel['params'] || [];

    }
  }

  collection(idx) {
    return this.data.simulation.collections[idx];
  }

  source() {
    return this.data.app.nodes[this.connectome.pre];
  }

  target() {
    return this.data.app.nodes[this.connectome.post];
  }

  isSpatial(idx) {
    var collection = this.collection(idx);
    return collection.hasOwnProperty('spatial');
  }

  keys(dict) {
    return Object.keys(dict)
  }

  selectedConnRule() {
    if (this.connectome.hasOwnProperty('conn_spec')) {
      return this.connectome.conn_spec.rule || 'all_to_all';
    }
    return 'all_to_all';
  }

  selectedSynModel() {
    if (this.connectome.hasOwnProperty('syn_spec')) {
      return this.connectome.syn_spec.model || 'static_synapse';
    }
    return 'static_synapse';
  }

  deleteLink() {
    this.data.simulation.connectomes = this.data.simulation.connectomes.filter((connectome, idx) => idx != this.idx);
    this.data.app.links = this.data.app.links.filter(link => link.idx != this.idx);
    this.data.app.links.forEach((link, idx) => {
      link.idx = idx;
    })
    this.linkChange.emit(this.data)
  }

  linkDisplay() {
    return this._networkService.isLinkSelected(this.link, this.data) ? '' : 'none';
  }

  paramDisplay(param) {
    return this.link.hasOwnProperty('display') ? this.link.display.includes(param) : true;
  }

  isBothSpatial() {
    var collections = this.data.simulation.collections;
    var pre = collections[this.connectome.pre];
    var post = collections[this.connectome.post];
    return pre.hasOwnProperty('spatial') && post.hasOwnProperty('spatial');
  }

  onChange() {
    // console.log('Change value in link controller')
    this.update()
    this._networkSketchService.update.emit()
    this.linkChange.emit(this.data)
  }

  onSelectSynModel(model) {
    this.connectome.syn_spec.model = model;
    this.update()
    this.linkChange.emit(this.data)
  }

  onSelectConnRule(rule) {
    this.connectome.conn_spec = {}
    this.connectome.conn_spec.rule = rule;
    this.link.display = ['conn_spec.rule', 'syn_spec.model', 'syn_spec.weight', 'syn_spec.delay'];
    var conn_spec = this._networkConfigService.config.connection.specs.find(conn_spec => conn_spec.rule == rule);
    if (conn_spec.hasOwnProperty('params')) {
      conn_spec.params.map(param => {
        this.connectome.conn_spec[param.id] = param.value;
        this.link.display.push('conn_spec.' + param.id);
      })
    }
    this.update()
    this.linkChange.emit(this.data)
  }

  onSelectConnectionType(value) {
    this.connectome.projections['connection_type'] = value;
    this.update()
    this.linkChange.emit(this.data)
  }

  onProjectionsValueChange(id, value) {
    // if (id == 'number_of_connections') {
    //   delete connectome.projections['kernel']
    // }
    // if (id == 'kernel') {
    //   delete connectome.projections['number_of_connections'];
    // }
    this.connectome.projections[id] = value;
    this.linkChange.emit(this.data)
  }

  onProjectionSelectionChange(event) {
    this.connectome.projections[event.option.value] = event.option.selected;
    this.linkChange.emit(this.data)
  }

  onMaskChange() {
    this.linkChange.emit(this.data)
  }
}
