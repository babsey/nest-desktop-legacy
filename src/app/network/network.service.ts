import { Injectable } from '@angular/core';

import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBUpsert from 'pouchdb-upsert/dist/pouchdb.upsert';

import { DataService } from '../services/data/data.service';
import { DBService } from '../services/db/db.service';
import { NavigationService } from '../navigation/navigation.service';
import { NetworkProtocolService } from './network-protocol/network-protocol.service';

declare function require(url: string);

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  public db: any;
  public networks: any[] = [];
  public ready: boolean;
  public mode: string = 'view';
  public version: string;

  constructor(
    private _dataService: DataService,
    private _dbService: DBService,
    private _navigationService: NavigationService,
    private _networkProtocolService: NetworkProtocolService,
  ) {
  }

  init() {
    this.db = this._dbService.init('network');
    this._dbService.checkVersion(this)
    this.loadNetworks().then(networks => {
      this.networks = this.networks.concat(networks)
      this.ready = true;
      this._networkProtocolService.loadNetworks().then(networks => {
        this.networks = this.networks.concat(networks)
        this._networkProtocolService.ready = true;
      })
    })
  }

  loadNetworks() {
    return this.count().then(count => {
      if (count == 0) {
        return this.fromFiles()
      } else {
        return this.list().then(networks => {
          networks.map(network => network['source'] = 'network')
          return networks;
        })
      }
    })
  }

  fromFiles() {
    var files = ['neuronal-states', 'spike-trains'];
    var networks = [];
    for (var idx in files) {
      var filename = files[idx];
      var data = require('./networks/' + filename + '.json');
      let data_cleaned = this._dataService.clean(data);
      networks.push(data_cleaned);
      this._dbService.db.create(this.db, data_cleaned)
    }
    return networks;
  }

  count() {
    return this._dbService.db.count(this.db)
  }

  list() {
    return this._dbService.db.list(this.db)
  }

  get(id) {
    return this.networks.find(network => network._id == id)
  }

  load(id) {
    return this._dbService.db.read(this.db, id).then(doc => {
      this._dataService['records'] = [];
      this._dataService['data'] = this._dataService.clean(doc);
      this._dataService.options.ready = true;
      return doc
    }).catch(err => {
      return this._networkProtocolService.load(id)
    })
  }

  hashList() {
    return this.list().then(docs => docs.map(row => row.hash))
  }

  save(data) {
    let data_cleaned = this._dataService.clean(data);
    return this.count().then(count => {
      if (count == 0) {
        return this._dbService.db.create(this.db, data_cleaned)
          .then(res => {
            this._dataService.data['_id'] = res.id;
          })
      } else {
        this.hashList().then(hash => {
          if (hash.indexOf(data_cleaned['hash']) != -1) {
            return this._dbService.db.update(this.db, data_cleaned)
          } else {
            return this._dbService.db.create(this.db, data_cleaned).then(res => {
              this._dataService.data['_id'] = res.id;
            })
          }
        })
      }
    })
  }

}
