import {
  Injectable,
  EventEmitter
} from '@angular/core';

import * as objectHash from 'object-hash';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public data: any = {
    _id: '',
    name: '',
    simulation: {
      time: 1000.0,
    },
    kernel: {},
    models: [],
    collections: [],
    connectomes: []
  };
  public ready: boolean = false;
  public selected: any = {
    collection: null,
    connectome: null,
  };
  public models: any;
  public changed: EventEmitter<any>;
  public records: any = [];

  constructor() {
    this.changed = new EventEmitter();
  }

  clone(data) {
    var new_data = {}
    if (data['simulation']) {
      new_data['simulation'] = data['simulation'];
    }
    if (data['kernel']) {
      new_data['kernel'] = data['kernel'];
    }
    if (data['collections']) {
      new_data['collections'] = data['collections'].map(collection => {
        var new_collection = {
          model: collection['model'],
          n: collection['n'] || 1,
          params: collection['params'] || {},
        };
        return new_collection
      })
    }
    if (data['layers']) {
      new_data['layers'] = data['layers'].map(layer => {
        return {
          specs: layer['specs']
        }
      })
    }
    if (data['connectomes']) {
      new_data['connectomes'] = data['connectomes'].map(connectome => {
        var conn_spec = connectome['conn_spec'] || {};
        if (!('rule' in conn_spec)) {
          conn_spec['rule'] = 'all_to_all';
        }
        var syn_spec = connectome['syn_spec'] || {};
        if (!('model' in syn_spec)) {
          syn_spec['model'] = 'static_synapse';
        }
        return {
          idx: connectome['idx'],
          pre: connectome['pre'],
          post: connectome['post'],
          conn_spec: conn_spec,
          syn_spec: syn_spec,
        }
      })
    }
    return new_data;
  }

  clean(data) {
    var new_data = this.clone(data);
    var hash = objectHash(new_data);
    new_data['_id'] = data['_id'];
    new_data['name'] = data['name'];
    new_data['description'] = data['description'];
    new_data['user'] = data['user'];
    new_data['group'] = data['group'];
    new_data['hash'] = hash;
    data['collections'].map((collection, i) => {
      new_data['collections'][i]['idx'] = collection['idx']
      new_data['collections'][i]['element_type'] = collection['element_type']
      new_data['collections'][i]['sketch'] = collection['sketch']
    })
    data['connectomes'].map((connectome, i) => {
      data['connectomes'][i] = connectome;
    })
    return new_data;
  }

  reduce(data, maxVal) {
    if (data.length < maxVal) return data

    let delta = Math.floor(data.length / maxVal);
    let reducedData = data.filter(function(value, index, Arr) {
      return index % delta == 0;
    }); ``

    return reducedData;
  }

}
