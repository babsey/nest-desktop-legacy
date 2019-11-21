import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';

import { AppConfigService } from '../../../config/app-config/app-config.service';
import { ColorService } from '../../services/color.service';
import { NetworkConfigService } from '../../network-config/network-config.service';
import { ModelService } from '../../../model/model.service';
import { NetworkService } from '../../services/network.service';
import { NetworkSketchService } from '../../network-sketch/network-sketch.service';

import { Data } from '../../../classes/data';
import { AppNode } from '../../../classes/appNode';
import { AppLink } from '../../../classes/appLink';
import { SimCollection } from '../../../classes/simCollection';
import { SimConnectome } from '../../../classes/simConnectome';


@Component({
  selector: 'app-link-controller',
  templateUrl: './link-controller.component.html',
  styleUrls: ['./link-controller.component.scss'],
})
export class LinkControllerComponent implements OnInit, OnChanges {
  @Input() data: Data;
  @Input() link: AppLink;
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  public collections: SimCollection[];
  public connectomes: SimConnectome[];
  public connectome: SimConnectome;
  public connOptions: any[] = [];
  public connRules: any[] = [];
  public options: any;
  public selection: boolean = false;
  public slider: any = {};
  public synModel: any;
  public synModels: any[] = [];
  public srcIdxOptions: any = {
    label: 'Source Indices',
    value: []
  };
  public tgtIdxOptions: any = {
    label: 'Target Indices',
    value: []
  };

  constructor(
    private _appConfigService: AppConfigService,
    private _colorService: ColorService,
    private _modelService: ModelService,
    private _networkService: NetworkService,
    private _networkSketchService: NetworkSketchService,
    public _networkConfigService: NetworkConfigService,
  ) { }

  ngOnInit() {
    this.update()
  }

  ngOnChanges() {
    // this.update()
  }

  advanced(): boolean {
    return this._appConfigService.config['app'].advanced;
  }

  update(): void {
    // console.log('Update link controller')
    if (this.link == undefined) return
    this.collections = this.data.simulation.collections;
    this.connectomes = this.data.simulation.connectomes;
    this.connectome = this.connectomes[this.link.idx];

    if (!this.hasProjections()) {
      this.validate()
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

  validate(): void {
    if (this.connectome.conn_spec == undefined) {
      this.connectome.conn_spec = { rule: 'all_to_all' };
    } else if (typeof this.connectome.conn_spec == 'string') {
      this.connectome.conn_spec = { rule: this.connectome.conn_spec }
    }
    if (this.connectome.syn_spec == undefined) {
      this.connectome.syn_spec = { model: 'static_synapse', weight: 1, delay: 1 };
    } else if (typeof this.connectome.syn_spec == 'string') {
      this.connectome.syn_spec = { model: this.connectome.syn_spec, weight: 1, delay: 1 };
    } else if (typeof this.connectome.syn_spec == 'object') {
      this.connectome.syn_spec['model'] = this.connectome.syn_spec['model'] || 'static_synapse';
      this.connectome.syn_spec['weight'] = this.connectome.syn_spec['weight'] != undefined ? this.connectome.syn_spec['weight'] : 1.;
      this.connectome.syn_spec['delay'] = this.connectome.syn_spec['delay'] || 1.;
    }
  }

  color(node: string): string {
    let nodes = this.data.app.nodes;
    return this._colorService.node(nodes[this.connectome[node]]);
  }

  source(): AppNode {
    return this.data.app.nodes[this.connectome.source];
  }

  target(): AppNode {
    return this.data.app.nodes[this.connectome.target];
  }

  connectRecorder(): boolean {
    var source = this.collections[this.connectome.source];
    var target = this.collections[this.connectome.target];
    return source.element_type == 'recorder' || target.element_type == 'recorder';
  }

  connectSpikeDetector(): boolean {
    var target = this.collections[this.connectome.target];
    var model = this.data.simulation.models[target.model];
    return model.existing == 'spike_detector';
  }

  linkDisplay(): string {
    return this._networkService.isLinkSelected(this.link, this.data) ? '' : 'none';
  }

  paramDisplay(param: string): boolean {
    return this.link.hasOwnProperty('display') ? this.link.display.includes(param) : true;
  }

  hasProjections(): boolean {
    return this.connectome.hasOwnProperty('projections');
  }

  onValueChange(value: any): void {
    this.dataChange.emit(this.data)
  }

  onDataChange(data: Data): void {
    this.dataChange.emit(this.data)
  }

  onRuleSelect(rule: string): void {
    this.connectome.conn_spec = {};
    this.connectome.conn_spec.rule = rule;
    this.link.display = ['syn_spec.weight', 'syn_spec.delay'];
    var conn_spec = this._networkConfigService.config.connection.specs.find(conn_spec => conn_spec.rule == rule);
    if (conn_spec.hasOwnProperty('params')) {
      conn_spec.params.map(param => {
        this.connectome.conn_spec[param.id] = param.value;
        this.link.display.push('conn_spec.' + param.id);
      })
    }
    this.update()
    this.dataChange.emit(this.data)
  }

  onModelSelect(model: string): void {
    this.dataChange.emit(this.data)
  }

  onConnectomeChange(connectome: SimConnectome): void {
    this.dataChange.emit(this.data)
  }

}
