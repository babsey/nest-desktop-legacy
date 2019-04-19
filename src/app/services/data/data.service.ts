import { Injectable, EventEmitter } from '@angular/core';

import * as objectHash from 'object-hash';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public options: any = {
    edit: false,
    ready: false,
  };
  public data: any;
  public selected: any;
  public models: any;
  public changed: EventEmitter<any>;
  public records: any[] = [];
  public undoStack: any[] = [];
  public redoStack: any[] = [];

  constructor() {
    this.changed = new EventEmitter();
    this.initData()
  }

  initData() {
    this.records = [];
    this.selected = {
      collection: null,
      connectome: null,
    };
    this.data = this.emptyData();
  }

  emptyData() {
    return {
      _id: '',
      name: '',
      kernel: {},
      models: {},
      collections: [],
      connectomes: [],
      simulation: {
        time: 1000.0,
      }
    }
  }

  clone(data) {
    var cloned = {}
    if (data['simulation']) {
      cloned['simulation'] = Object.assign({}, data['simulation']);
    }
    if (data['kernel']) {
      cloned['kernel'] = Object.assign({}, data['kernel']);
    }
    if (data['models']) {
      cloned['models'] = Object.assign({}, data['models']);
    }
    if (data['collections']) {
      cloned['collections'] = data['collections'].map(collection => {
        var newCollection = Object.assign({}, {
          idx: collection['idx'],
          element_type: collection['element_type'],
          model: collection['model'],
        })
        if ('topology' in collection) {
          var topology = collection['topology'];
          newCollection['topology'] = topology;
        } else {
          newCollection['n'] = collection['n'] || 1;
        }
        return newCollection
      })
    }
    if (data['connectomes']) {
      cloned['connectomes'] = data['connectomes'].map(connectome => {
        var newConnectome = {
          idx: connectome['idx'],
          pre: connectome['pre'],
          post: connectome['post'],
        };
        if (this.isBothLayer(connectome, data['collections'])) {
          newConnectome['projections'] = Object.assign({
            'allow_autapses': true,
            'allow_multapses': true,
            'connection_type': 'divergent'
          }, connectome['projections']);
        } else {
          newConnectome['conn_spec'] = Object.assign({ 'rule': 'all_to_all' }, connectome['conn_spec']);
          newConnectome['syn_spec'] = Object.assign({ 'model': 'static_synapse' }, connectome['syn_spec']);
        }
        return newConnectome;
      })
    }
    return cloned;
  }

  clean(data) {
    // console.log(data)
    var cloned_data = this.clone(data);
    cloned_data['hash'] = objectHash(cloned_data);
    cloned_data['_id'] = data['_id'];
    cloned_data['updatedAt'] = data['updatedAt'];
    cloned_data['name'] = data['name'];
    cloned_data['description'] = data['description'];
    cloned_data['user'] = data['user'];
    cloned_data['group'] = data['group'];
    cloned_data['collections'].map((d, i) => {
      d['sketch'] = data['collections'][i]['sketch'];
      if (data['collections'][i]['color']) {
        d['color'] = data['collections'][i]['color'];
      }
      if (data['collections'][i]['display']) {
        d['display'] = data['collections'][i]['display'];
      }
    });
    cloned_data['connectomes'].map((d, i) => {
      if (data['connectomes'][i]['display']) {
        d['display'] = data['connectomes'][i]['display'];
      }
    })

    return cloned_data
  }

  undo() {
    // console.log('Undo data')
    if (this.undoStack.length == 1) return
    this.redoStack.unshift(this.undoStack.pop());
    this.data = this.undoStack[this.undoStack.length - 1];
  }

  redo() {
    // console.log('Redo data')
    if (this.redoStack.length == 0) return
    this.undoStack.push(this.redoStack.shift());
    this.data = this.undoStack[this.undoStack.length - 1];
  }

  history(data) {
    var data_cleaned = this.clean(data);
    if (this.undoStack.length == 0) {
      this.undoStack.push(data_cleaned)
    } else if (data_cleaned['hash'] != this.undoStack[this.undoStack.length - 1]['hash']) {
      this.undoStack.push(data_cleaned)
    }
    this.redoStack = [];
  }

  deleteNode(idx) {
    var data = this.data;
    this.history(data)

    var models = data.models;
    data.models = {};
    var collections = data.collections.filter(d => d.idx != idx);
    collections.forEach((d, i) => {
      d.idx = i;
      var model = models[d.model];
      var newModel = d.element_type + '-' + d.idx;
      data.models[newModel] = model;
      d.model = newModel;
    })
    data.collections = collections;
    console.log(data)

    var connectomes = data.connectomes.filter(d => d.pre != idx && d.post != idx);
    if (connectomes.length != data.connectomes.length) {
      connectomes.forEach((d, i) => {
        d.idx = i;
        d.pre = d.pre > idx ? d.pre - 1 : d.pre;
        d.post = d.post > idx ? d.post - 1 : d.post;
      })
      data.connectomes = connectomes;
    }
  }

  deleteLink(idx) {
    var data = this.data;
    this.history(data)

    var connectomes = data.connectomes.filter(d => d.idx != idx);
    connectomes.forEach((d, i) => {
      d.idx = i;
    })
    data.connectomes = connectomes;
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

  newNode() {
    return {
      params: {},
    }
  }

  newLink() {
    return {
      conn_spec: {
        rule: 'all_to_all',
      },
      syn_spec: {
        model: 'static_synapse'
      }
    }
  }

  isBothLayer(connectome, collections=null) {
    var collection = collection || this.data.collections;
    var pre = collections[connectome.pre];
    var post = collections[connectome.post];
    return pre.hasOwnProperty('topology') && post.hasOwnProperty('topology');
  }

}
