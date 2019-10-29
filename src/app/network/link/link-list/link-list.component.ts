import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { AppConfigService } from '../../../config/app-config/app-config.service';
import { ColorService } from '../../services/color.service';
import { ModelService } from '../../../model/model.service';
import { FormatService } from '../../../services/format/format.service';
import { NetworkConfigService } from '../../network-config/network-config.service';
import { NetworkService } from '../../services/network.service';

import { Data } from '../../../classes/data';
import { AppNode } from '../../../classes/appNode';
import { AppLink } from '../../../classes/appLink';
import { SimCollection } from '../../../classes/simCollection';
import { SimConnectome } from '../../../classes/simConnectome';


@Component({
  selector: 'app-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.scss']
})
export class LinkListComponent implements OnInit {
  @Input() data: Data;
  @Input() link: AppLink;
  @Input() selective: boolean = false;
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  public connectome: SimConnectome;

  constructor(
    private _appConfigService: AppConfigService,
    private _modelService: ModelService,
    private _networkConfigService: NetworkConfigService,
    private _networkService: NetworkService,
    public _colorService: ColorService,
    public _formatService: FormatService,
  ) { }

  ngOnInit() {
    this.update()
  }

  advanced(): boolean {
    return this._appConfigService.config['app'].advanced;
  }

  update(): void {
    if (this.link == undefined) return
    this.connectome = this.data.simulation.connectomes[this.link.idx];
  }

  color(node: string): string {
    let nodes = this.data.app.nodes;
    return this._colorService.node(nodes[this.connectome[node]])
  }

  collection(idx: number): SimCollection {
    return this.data.simulation.collections[idx];
  }

  source(): AppNode {
    return this.data.app.nodes[this.connectome.pre];
  }

  target(): AppNode {
    return this.data.app.nodes[this.connectome.post];
  }

  isSpatial(idx: number): boolean {
    var collection = this.collection(idx);
    return collection.hasOwnProperty('spatial');
  }

  selectNode(idx: number): void {
    var node = this.data.app.nodes[idx];
    this._networkService.selectNode(node)
  }

  selectLink(): void {
    this._networkService.selectLink(this.link)
  }

  paramDisplay(param: string): boolean {
    return this.link.hasOwnProperty('display') ? this.link.display.includes(param) || !this.selective : true;
  }

  isBothSpatial(): boolean {
    var collections = this.data.simulation.collections;
    var pre = collections[this.connectome.pre];
    var post = collections[this.connectome.post];
    return pre.hasOwnProperty('spatial') && post.hasOwnProperty('spatial');
  }

  isProjections(): boolean {
    return this.connectome.hasOwnProperty('projections')
  }

  connRule(): string {
    if (!this.connectome.hasOwnProperty('conn_spec')) return 'all_to_all'
    return this.connectome.conn_spec.rule || 'all_to_all'
  }

  synModel(): string {
    if (!this.connectome.hasOwnProperty('syn_spec')) return 'static_synapse'
    return this.connectome.syn_spec.model || 'static_synapse'
  }

  synWeight(): number {
    var weight = 1;
    if (this.connectome.hasOwnProperty('syn_spec')) {
      weight = this.connectome.syn_spec.weight || weight;
    }
    return this._formatService.format(weight);
  }

  synDelay(): number {
    var delay = 1;
    if (this.connectome.hasOwnProperty('syn_spec')) {
      delay = this.connectome.syn_spec.delay || delay;
    }
    return this._formatService.format(delay);
  }

  synWeights(): any {
    if (!this.connectome.projections.hasOwnProperty('weights')) {
      return this._formatService.format(1)
    }
    if (this.connectome.projections.weights.parametertype == 'constant') {
      return this._formatService.format(this.connectome.projections.weights.specs.value)
    }
    return this.connectome.projections.weights.parametertype
  }

  synDelays(): any {
    if (!this.connectome.projections.hasOwnProperty('delays')) {
      return this._formatService.format(1)
    }
    if (this.connectome.projections.delays.parametertype == 'constant') {
      return this._formatService.format(this.connectome.projections.weights.specs.value)
    }
    return this.connectome.projections.delays.parametertype
  }

  onDataChange(data: Data): void {
    this.dataChange.emit(this.data)
  }

}
