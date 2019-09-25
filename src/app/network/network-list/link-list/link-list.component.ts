import { Component, OnInit, Input } from '@angular/core';

import { AppConfigService } from '../../../config/app-config/app-config.service';
import { ColorService } from '../../services/color.service';
import { ModelService } from '../../../model/model.service';
import { FormatService } from '../../../services/format/format.service';
import { NetworkConfigService } from '../../network-config/network-config.service';
import { NetworkService } from '../../services/network.service';

import { Data } from '../../../classes/data';


@Component({
  selector: 'app-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.scss']
})
export class LinkListComponent implements OnInit {
  @Input() data: Data;
  @Input() idx: number;
  @Input() selective: boolean = false;
  public link: any = {};
  public connectome: any = {};
  public postColor: string;
  public preColor: string;
  public backgroundImage: string;

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

  selectNode(idx) {
    var node = this.data.app.nodes[idx];
    this._networkService.selectNode(node)
  }

  selectLink() {
    this._networkService.selectLink(this.link)
  }

  paramDisplay(param) {
    return this.link.hasOwnProperty('display') ? this.link.display.includes(param) || !this.selective : true;
  }

  isBothSpatial() {
    var collections = this.data.simulation.collections;
    var pre = collections[this.connectome.pre];
    var post = collections[this.connectome.post];
    return pre.hasOwnProperty('spatial') && post.hasOwnProperty('spatial');
  }

  connRule() {
    if (!this.connectome.hasOwnProperty('conn_spec')) return 'all_to_all'
    return this.connectome.conn_spec.rule || 'all_to_all'
  }

  synModel() {
    if (!this.connectome.hasOwnProperty('syn_spec')) return 'static_synapse'
    return this.connectome.syn_spec.model || 'static_synapse'
  }

  synWeight() {
    var weight = 1;
    if (this.connectome.hasOwnProperty('syn_spec')) {
      weight = this.connectome.syn_spec.weight || weight;
    }
    return this._formatService.format(weight);
  }

  synDelay() {
    var delay = 1;
    if (this.connectome.hasOwnProperty('syn_spec')) {
      delay = this.connectome.syn_spec.delay || delay;
    }
    return this._formatService.format(delay);
  }

  synWeights() {
    if (!this.connectome.projections.hasOwnProperty('weights')) {
      return this._formatService.format(1)
    }
    if (this.connectome.projections.weights.parametertype == 'constant') {
      return this._formatService.format(this.connectome.projections.weights.specs.value)
    }
    return this.connectome.projections.weights.parametertype
  }

  synDelays() {
    if (!this.connectome.projections.hasOwnProperty('delays')) {
      return this._formatService.format(1)
    }
    if (this.connectome.projections.delays.parametertype == 'constant') {
      return this._formatService.format(this.connectome.projections.weights.specs.value)
    }
    return this.connectome.projections.delays.parametertype
  }

}
