import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material';

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

  constructor(
    private snackBar: MatSnackBar,
  ) { }

  isNodeSelected(node: AppNode, data: Data, unselected: boolean = true, withLink: boolean = true): boolean {
    if (this.selected.node) {
      return this.selected.node == node;
    } else if (this.selected.link) {
      if (!withLink) return false
      var links = data.app.links.filter(link => {
        var connectome = data.simulation.connectomes[link.idx];
        return connectome.pre == node.idx || connectome.post == node.idx;
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
      var node = data.app.nodes[connectome.pre];
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
    var pre = collections[connectome.pre];
    var post = collections[connectome.post];
    return pre.hasOwnProperty('spatial') && post.hasOwnProperty('spatial');
  }

  getPositionsForRecord(data: Data, record: Record): number[][] {
    var node = record.recorder.model == 'spike_detector' ? 'pre' : 'post';
    var recorder = record.recorder.model == 'spike_detector' ? 'post' : 'pre';
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
  }

  addModel(data: Data, elementType: string): void {
    var idx = data.app.nodes.length;
    var newModel = elementType + '-' + idx;
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
    var idx = data.simulation.collections.length;
    data.simulation.collections.push({
      model: elementType + '-' + idx,
      element_type: elementType,
      n: 1,
      params: {},
    })
  }

  connect(data: Data, source: AppNode, target: AppNode): void {
    var connectomes = data.simulation.connectomes;
    var checkLinks = data.app.links.filter(link => (
      connectomes[link.idx].pre == source.idx && connectomes[link.idx].post == target.idx));
    if (checkLinks.length == 0) {
      this.addConnectome(data, source, target);
      this.addLink(data);
      this.validateLinks(data, true);
    }
  }

  addLink(data: Data): void {
    data.app.links.push({
      idx: data.app.links.length,
    })
  }

  addConnectome(data: Data, source: AppNode, target: AppNode): void {
    data.simulation.connectomes.push({
      pre: source.idx,
      post: target.idx,
    })
  }

  validate(data: Data, message: boolean = false): void {
    this.validateLinks(data, message)
  }

  validateLinks(data: Data, message: boolean = false): void {
    var validated = false;
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

      if (connectome.pre == connectome.post) return
      var preCollection = collections[connectome.pre];
      var postCollection = collections[connectome.post];
      var preModel = models[preCollection.model].existing;
      var postModel = models[postCollection.model].existing;
      if (
        // postCollection.element_type == 'stimulator' ||
        preModel == 'spike_detector' ||
        ['voltmeter', 'multimeter'].includes(postModel)
      ) {
        connectome.post = [connectome.pre, connectome.pre = connectome.post][0];
        validated = true;
      }
    })
    if (message && validated) {
      setTimeout(() =>
        this.snackBar.open('Warning! A connection was reversed.', null, { duration: 2000 }), 100);
    }
  }

}
