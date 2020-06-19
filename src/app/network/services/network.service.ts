import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as objectHash from 'object-hash';

import { ColorService } from './color.service';
import { NetworkConfigService } from '../network-config/network-config.service';

import { Data } from '../../classes/data';
import { AppNode } from '../../classes/appNode';
import { AppLink } from '../../classes/appLink';
import { Record } from '../../classes/record';
import { SimCollection } from '../../classes/simCollection';
import { SimConnectome } from '../../classes/simConnectome';


@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  public selected: any = {
    node: null,
    link: null,
  }
  public elementType = null;
  public update: EventEmitter<any> = new EventEmitter();
  public modelDefaults = {
    stimulator: 'dc_generator',
    neuron: 'iaf_psc_alpha',
    recorder: 'voltmeter',
  };
  public recorderChanged: boolean = false;
  public quickView: boolean = false;
  private abc = 'abcdefghijklmnopqrstuvwxyz123456789';

  constructor(
    private _colorService: ColorService,
    private _networkConfigService: NetworkConfigService,
    private snackBar: MatSnackBar,
  ) { }

  isNodeSelected(node: AppNode, data: Data, unselected: boolean = true, withLink: boolean = true): boolean {
    if (this.selected.node) {
      return this.selected.node == node;
    } else if (this.selected.link) {
      if (!withLink) return false
      var links = data.app.links.filter(link => {
        var connectome = data.simulation.connectomes[link.idx];
        return connectome.source == node.idx || connectome.target == node.idx;
      })
      var selected = links.filter(link => this.selected.link == link);
      return selected.length > 0;
    }
    return unselected;
  }

  isLinkSelected(link: AppLink, data: Data, unselected: boolean = true): boolean {
    if (this.selected.link) {
      return this.selected.link == link;
    } else if (this.selected.node) {
      var connectome = data.simulation.connectomes[link.idx];
      var node = data.app.nodes[connectome.source];
      return this.selected.node == node;
    }
    return unselected;
  }

  selectNode(node: AppNode, elementType: string = null): void {
    this.selected.node = this.selected.node == node ? null : node;
    this.elementType = this.selected.node || this.elementType != null ? elementType : null;
    this.selected.link = null;
  }

  selectLink(link: AppLink): void {
    this.elementType = null;
    this.selected.node = null;
    this.selected.link = this.selected.link == link ? null : link;
  }

  selectElementType(elementType: string): void {
    this.elementType = elementType;
    // this.elementType = this.elementType == elementType ? null : elementType;
    this.resetSelection()
  }

  resetSelection(): void {
    this.selected.node = null;
    this.selected.link = null;
  }

  isBothSpatial(connectome: SimConnectome, collections: SimCollection[]): boolean {
    var source = collections[connectome.source];
    var target = collections[connectome.target];
    return source.hasOwnProperty('spatial') && target.hasOwnProperty('spatial');
  }

  getPositionsForRecord(data: Data, record: Record): number[][] {
    var node = record.recorder.model == 'spike_detector' ? 'source' : 'target';
    var recorder = record.recorder.model == 'spike_detector' ? 'target' : 'source';
    var nodes = data.simulation.connectomes
      .filter(connectome => connectome[recorder] == record.recorder.idx)
      .filter(connectome => data.app.nodes[connectome[node]].hasOwnProperty('positions'))
      .map(connectome => data.app.nodes[connectome[node]]);

    var positions = [];
    nodes.map(node => positions = positions.concat(node.positions));
    return positions;
  }

  create(data: Data, elementType: string, point: number[]): void {
    this.addModel(data, elementType);
    this.addCollection(data, elementType);
    this.addNode(data, point);
    this.clean(data);
    this.hash(data);
  }

  addModel(data: Data, elementType: string): void {
    var newModel = elementType + '-' + this.abc[data.app.nodes.length];
    data.app.models[newModel] = {
      display: [],
    };
    data.simulation.models[newModel] = {
      existing: this.modelDefaults[elementType],
      params: {},
    };
  }

  addNode(data: Data, point: number[]): void {
    var idx = data.app.nodes.length;
    data.app.nodes.push({
      idx: idx,
      position: { x: point[0], y: point[1] },
    })
  }

  addCollection(data: Data, elementType: string): void {
    data.simulation.collections.push({
      model: elementType + '-' + this.abc[data.simulation.collections.length],
      element_type: elementType,
      n: 1,
      params: {},
    })
  }

  deleteNode(data: Data, node: AppNode): void {
    data.app.nodes = data.app.nodes.filter((n, idx) => idx != node.idx);
    data.simulation.collections = data.simulation.collections.filter((n, idx) => idx != node.idx);
    data.app.nodes.forEach((n, idx) => n.idx = idx)

    var links = data.app.links.filter(link => {
      var connectome = data.simulation.connectomes[link.idx];
      return connectome.source != node.idx && connectome.target != node.idx;
    });
    if (links.length != data.simulation.connectomes.length) {
      links.forEach((link, idx) => link.idx = idx)
      data.app.links = links;
      var connectomes = data.simulation.connectomes.filter(connectome => connectome.source != node.idx && connectome.target != node.idx);
      connectomes.forEach(connectome => {
        connectome.source = connectome.source > node.idx ? connectome.source - 1 : connectome.source;
        connectome.target = connectome.target > node.idx ? connectome.target - 1 : connectome.target;
      })
      data.simulation.connectomes = connectomes;
    }
    this.hash(data);
  }

  connect(data: Data, source: AppNode, target: AppNode): void {
    var connectomes = data.simulation.connectomes;
    var checkLinks = data.app.links.filter(link => (connectomes[link.idx].source == source.idx && connectomes[link.idx].target == target.idx));
    if (checkLinks.length == 0) {
      this.addConnectome(data, source, target);
      this.addLink(data);
      this.clean(data, true);
      this.hash(data);
    }
  }

  addLink(data: Data): void {
    data.app.links.push({
      idx: data.app.links.length,
    })
  }

  addConnectome(data: Data, source: AppNode, target: AppNode): void {
    data.simulation.connectomes.push({
      source: source.idx,
      target: target.idx,
    })
  }

  deleteLink(data: Data, link: AppLink): void {
    data.app.links = data.app.links.filter(l => l.idx != link.idx);
    data.simulation.connectomes = data.simulation.connectomes.filter((connectome, idx) => idx != link.idx);
    data.app.links.forEach((l, idx) => l.idx = idx)
    this.clean(data);
    this.hash(data);
  }

  clean(data: Data, message: boolean = false): void {
    this.cleanLinks(data, message)
    this.cleanModels(data)
    if (this._networkConfigService.config.color['autoColorRec']) {
      this.cleanRecColor(data)
    }
  }

  cleanLinks(data: Data, message: boolean = false): void {
    var cleaned = false;
    var models = data.simulation.models;
    var collections = data.simulation.collections;
    var connectomes = data.simulation.connectomes;
    connectomes.map(connectome => {
      var conn_spec = connectome['conn_spec'] || { rule: 'all_to_all' };
      var syn_spec = connectome['syn_spec'] || { model: 'static_synapse', weight: 1, delay: 1 };
      if (this.isBothSpatial(connectome, collections) && !connectome.hasOwnProperty('projections')) {
        var weight = syn_spec.hasOwnProperty('weight') ? syn_spec['weight'] : 1;
        var delay = syn_spec.hasOwnProperty('delay') ? syn_spec['delay'] : 1;
        var projections = {
          weights: weight,
          delays: delay,
        };
        if (conn_spec && conn_spec.hasOwnProperty('rule')) {
          switch (conn_spec['rule']) {
            case 'fixed_indegree':
              projections['connection_type'] = 'convergent';
              projections['number_of_connections'] = conn_spec['indegree'];
              break;
            case 'fixed_outdegree':
              projections['connection_type'] = 'divergent';
              projections['number_of_connections'] = conn_spec['outdegree'];
              break;
            default:
              projections['connection_type'] = 'convergent';
              projections['kernel'] = 1;
              break;
          }
        } else {
          projections['connection_type'] = 'convergent';
          projections['kernel'] = 1;
        }
        connectome['projections'] = projections;
        delete connectome['conn_spec']
        delete connectome['syn_spec']
      }
      if (!this.isBothSpatial(connectome, collections) && connectome.hasOwnProperty('projections')) {
        syn_spec.weight = connectome.projections.weights;
        syn_spec.delay = connectome.projections.delays;
        connectome['conn_spec'] = conn_spec;
        connectome['syn_spec'] = syn_spec;
        delete connectome['projections']
      }

      if (connectome.source == connectome.target) return
      var sourceCollection = collections[connectome.source];
      var targetCollection = collections[connectome.target];
      var sourceModel = models[sourceCollection.model].existing;
      var targetModel = models[targetCollection.model].existing;
      if (
        // targetCollection.element_type == 'stimulator' ||
        sourceModel == 'spike_detector' ||
        ['voltmeter', 'multimeter'].includes(targetModel)
      ) {
        connectome.target = [connectome.source, connectome.source = connectome.target][0];
        cleaned = true;
      }
    })
    if (message && cleaned) {
      setTimeout(() =>
        this.snackBar.open('Warning! A connection was reversed.', null, { duration: 2000 }), 100);
    }
  }

  cleanConnectome(connectome: SimConnectome): void {
    if (connectome.conn_spec == undefined) {
      connectome.conn_spec = { rule: 'all_to_all' };
    } else if (typeof connectome.conn_spec == 'string') {
      connectome.conn_spec = { rule: connectome.conn_spec }
    }
    if (connectome.syn_spec == undefined) {
      connectome.syn_spec = { model: 'static_synapse', weight: 1, delay: 1 };
    } else if (typeof connectome.syn_spec == 'string') {
      connectome.syn_spec = { model: connectome.syn_spec, weight: 1, delay: 1 };
    } else if (typeof connectome.syn_spec == 'object') {
      connectome.syn_spec['model'] = connectome.syn_spec['model'] || 'static_synapse';
      connectome.syn_spec['weight'] = connectome.syn_spec['weight'] != undefined ? connectome.syn_spec['weight'] : 1.;
      connectome.syn_spec['delay'] = connectome.syn_spec['delay'] || 1.;
    }
  }

  cleanRecColor(data: Data): void {
    var recorders = data.app.nodes.filter(node => data.simulation.collections[node.idx].element_type == 'recorder');
    recorders.map(recorder => {
      var links = data.simulation.connectomes.filter(link => (link.source == recorder.idx || link.target == recorder.idx));
      if (links.length == 1) {
        var link = links[0];
        var nodeIdx = link.source != recorder.idx ? link.source : link.target;
        var node = data.app.nodes[nodeIdx];
        if (!recorder.hasOwnProperty('color')) {
          recorder['color'] = node.idx; //node['color'] || this._colorService.node(node);
        }
      } else {
        delete recorder.color
      }
    })
  }

  cleanModels(data: Data): void {
    var simModels = data.simulation.models;
    var appModels = data.app.models;
    data.simulation.models = {};
    data.app.models = {};
    data.app.nodes.forEach(node => {
      var collection = data.simulation.collections[node.idx];
      var newName = collection.element_type + '-' + this.abc[node.idx];
      data.simulation.models[newName] = simModels[collection.model];
      data.app.models[newName] = appModels[collection.model];
      collection['model'] = newName;
    })
  }

  hash(data: Data): void {
    data['hash'] = objectHash(data.simulation);
  }

}
