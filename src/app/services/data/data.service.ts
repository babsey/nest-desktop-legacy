import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import * as objectHash from 'object-hash';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public options: any = {
    edit: false,
    ready: false,
  };
  public selected: any;
  public models: any;
  public changed: EventEmitter<any> = new EventEmitter();
  public mode: string = 'details';

  constructor(
    private snackBar: MatSnackBar,
  ) {
    this.initData()
  }

  initData() {
    this.selected = {
      collection: null,
      connectome: null,
    };
  }

  emptyData() {
    return {
      _id: '',
      name: '',
      description: '',
      hash: '',
      createdAt: '',
      updatedAt: '',
      user: '',
      group: '',
      app: {
        kernel: { time: 0 },
        models: {},
        nodes: [],
        links: []
      },
      simulation: {
        kernel: {},
        models: {},
        collections: [],
        connectomes: [],
        time: 1000.0
      },

    }
  }

  newCollection() {
    return {
      params: {},
    }
  }

  newConnectome() {
    return {
      conn_spec: {
        rule: 'all_to_all',
      },
      syn_spec: {
        model: 'static_synapse'
      }
    }
  }

  hash(data) {
    return objectHash(data);
  }

  clean(data) {
    // console.log('Clean data')
    var newData = JSON.parse(JSON.stringify(data))
    this.deleteGlobalIds(newData.app.nodes);

    this.validate(newData);
    newData['hash'] = this.hash(newData['simulation']);
    return newData;
  }

  deleteGlobalIds(nodes) {
    nodes.forEach(node => {
      if (node.hasOwnProperty('global_ids')) {
        delete node.global_ids
      }
    })
  }

  reduce(data, maxVal) {
    if (data.length < maxVal) return data
    let delta = Math.floor(data.length / maxVal);
    let reducedData = data.filter(function(value, index, Arr) {
      return index % delta == 0;
    });
    return reducedData;
  }

  sortByProperty(property) {
    var sortOrder = 1;

    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }

    return (a: any, b: any) => {
      if (sortOrder == -1) {
        return b[property].localeCompare(a[property]);
      } else {
        return a[property].localeCompare(b[property]);
      }
    }
  }

  sortByDate(key) {
    return (a: any, b: any) => {
      var dateB: any = new Date(b[key]);
      var dateA: any = new Date(a[key]);
      return dateB - dateA;
    }
  }

  isBothSpatial(connectome, collections) {
    var pre = collections[connectome.pre];
    var post = collections[connectome.post];
    return pre.hasOwnProperty('spatial') && post.hasOwnProperty('spatial');
  }

  deleteNode(data, idx) {
    data.app.nodes = data.app.nodes.filter((node, i) => i != idx);
    data.simulation.collections = data.simulation.collections.filter((node, i) => i != idx);
    data.app.nodes.forEach((node, i) => node.idx = i)

    var links = data.app.links.filter(link => {
      var connectome = data.simulation.connectomes[link.idx];
      return connectome.pre != idx && connectome.post != idx;
    });
    if (links.length != data.simulation.connectomes.length) {
      links.forEach((link, i) => link.idx = i)
      data.app.links = links;
      var connectomes = data.simulation.connectomes.filter(connectome => connectome.pre != idx && connectome.post != idx);
      connectomes.forEach(connectome => {
        connectome.pre = connectome.pre > idx ? connectome.pre - 1 : connectome.pre;
        connectome.post = connectome.post > idx ? connectome.post - 1 : connectome.post;
      })
      data.simulation.connectomes = connectomes;
    }
    this.validateModels(data)
  }

  deleteLink(data, idx) {
    data.simulation.connectomes = data.simulation.connectomes.filter((connectome, i) => i != idx);
    data.app.links = data.app.links.filter(link => link.idx != idx);
    data.app.links.forEach((link, i) => link.idx = i)
  }

  validate(data) {
    this.validateKernel(data)
    this.validateModels(data)
    this.validateLinks(data)
  }

  validateKernel(data) {
    data.app['kernel'] = { time: 0 };
    if (!data.simulation.kernel.hasOwnProperty('resolution')) {
      data.simulation.kernel['resolution'] = 0.1;
    }
  }

  validateLinks(data) {
    var validated = false;
    var models = data.simulation.models;
    var collections = data.simulation.collections;
    var connectomes = data.simulation.connectomes;
    connectomes.map(connectome => {
      if (this.isBothSpatial(connectome, collections) && !connectome.hasOwnProperty('projections')) {
        var conn_spec = connectome.conn_spec;
        var weights = { parametertype: 'constant', specs: { value: 1 } };
        var delays = { parametertype: 'constant', specs: { value: 1 } };
        if (conn_spec && conn_spec.hasOwnProperty('rule')) {
          var connection_type = conn_spec['rule'] == 'fixed_indegree' ? 'convergent' : 'convergent';
          var number_of_connections = conn_spec['indegree'] || conn_spec['outdegree'] || 1;
          connectome['projections'] = {
            connection_type: connection_type,
            number_of_connections: number_of_connections,
            weights: weights,
            delays: delays
          };
        } else {
          var kernel = { parametertype: 'constant', specs: { value: 1 } };
          connectome['projections'] = {
            connection_type: 'divergent',
            kernel: kernel,
            weights: weights,
            delays: delays
          };
        }
        delete connectome['conn_spec']
        delete connectome['syn_spec']
      }
      if (!this.isBothSpatial(connectome, collections) && connectome.hasOwnProperty('projections')) {
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
    if (validated) {
      setTimeout(() =>
        this.snackBar.open('Warning! A connection was reversed.', null, {duration: 2000}), 100);
    }
  }

  validateModels(data) {
    var simModels = data.simulation.models;
    var appModels = data.app.models;
    data.simulation.models = {};
    data.app.models = {};
    data.app.nodes.forEach(node => {
      var collection = data.simulation.collections[node.idx];
      var newName = collection.element_type + '-' + node.idx;
      data.simulation.models[newName] = simModels[collection.model];
      collection['model'] = newName;
      data.app.models[newName] = appModels[collection.model];
    })
  }

}
