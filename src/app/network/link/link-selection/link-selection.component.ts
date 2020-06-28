import { Component, Input, OnInit, OnChanges, Output, EventEmitter, ViewChild } from '@angular/core';

import { MatMenuTrigger } from '@angular/material/menu';

import { AppConfigService } from '../../../config/app-config/app-config.service';
import { ColorService } from '../../services/color.service';
import { ModelService } from '../../../model/model.service';
import { NetworkConfigService } from '../../network-config/network-config.service';
import { NetworkService } from '../../services/network.service';

import { Data } from '../../../classes/data';
import { AppNode } from '../../../classes/appNode';
import { AppLink } from '../../../classes/appLink';
import { SimCollection } from '../../../classes/simCollection';
import { SimConnectome } from '../../../classes/simConnectome';


@Component({
  selector: 'app-link-selection',
  templateUrl: './link-selection.component.html',
  styleUrls: ['./link-selection.component.scss'],
})
export class LinkSelectionComponent implements OnInit, OnChanges {
  @Input() data: Data;
  @Input() link: AppLink;
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  public connOptions: any[] = [];
  public connRules: any[] = [];
  public connectome: SimConnectome;
  public options: any;
  public slider: any = {};
  public synModel: any;
  public synModels: any[] = [];

  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private _appConfigService: AppConfigService,
    private _colorService: ColorService,
    private _modelService: ModelService,
    private _networkConfigService: NetworkConfigService,
    private _networkService: NetworkService,
  ) { }

  ngOnInit(): void {
    // this.update()
  }

  ngOnChanges(): void {
    // console.log('Update link selection')
    this.update()
  }

  color(src: string): string {
    return this._colorService.node(this.connectome[src]);
  }

  update(): void {
    if (this.link == undefined) return
    this.connectome = this.data.simulation.connectomes[this.link.idx];

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

  collection(idx: number): SimCollection {
    return this.data.simulation.collections[idx];
  }

  source(): AppNode {
    return this.data.app.nodes[this.connectome.source];
  }

  target(): AppNode {
    return this.data.app.nodes[this.connectome.target];
  }

  selectedConnRule(): string {
    if (this.connectome.hasOwnProperty('conn_spec')) {
      return this.connectome.conn_spec.rule || 'all_to_all';
    }
    return 'all_to_all';
  }

  selectedSynModel(): string {
    if (this.connectome.hasOwnProperty('syn_spec')) {
      return this.connectome.syn_spec.model || 'static_synapse';
    }
    return 'static_synapse';
  }

  linkDisplay(): string {
    return this._networkService.isLinkSelected(this.link, this.data) ? '' : 'none';
  }

  paramDisplay(param: string): boolean {
    return this.link.hasOwnProperty('display') ? this.link.display.includes(param) : true;
  }

  isBothSpatial(): boolean {
    return this.connectome.isBothSpatial(this.data);
  }

  onDataChange(data: Data): void {
    this.dataChange.emit(this.data)
  }

  onSelectSynModel(model: string): void {
    this.connectome.syn_spec.model = model;
    this.update()
    this.dataChange.emit(this.data)
  }

  onSelectConnRule(rule: string): void {
    this.connectome.conn_spec = {};
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
    this.dataChange.emit(this.data)
  }

  onSelectConnectionType(value: any): void {
    this.connectome.projections['connection_type'] = value;
    this.update()
    this.dataChange.emit(this.data)
  }

  onProjectionsValueChange(id: string, value: any): void {
    // if (id == 'number_of_connections') {
    //   delete connectome.projections['kernel']
    // }
    // if (id == 'kernel') {
    //   delete connectome.projections['number_of_connections'];
    // }
    this.connectome.projections[id] = value;
    this.dataChange.emit(this.data)
  }

  onProjectionSelectionChange(event: any): void {
    this.connectome.projections[event.option.value] = event.option.selected;
    this.dataChange.emit(this.data)
  }

}
