import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

import * as objectHash from 'object-hash';

import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBUpsert from 'pouchdb-upsert/dist/pouchdb.upsert';

import { DataService } from '../data/data.service';
import { ProtocolService } from '../protocol/protocol.service';
import { MathService } from '../math/math.service';

declare function require(url: string);

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  public db: any;
  public searchTerm; string = '';

  constructor(
    // private http: HttpClient,
    private _dataService: DataService,
    private _protocolService: ProtocolService,
    private _mathService: MathService,
  ) {
    this.db = new PouchDB('networks');
    // this.db.destroy()
  }

  viewAll() {
    this.db.allDocs({ include_docs: true })
      .catch((err) => console.log(err));
  }

  filter(obj) {
    // https://stackblitz.com/edit/angular-material-mat-select-filter
    obj.filteredNetworks = obj.networks;
    if (this.searchTerm) {
      let result: string[] = [];
      for (let network of obj.networks) {
        if (network.doc.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) {
          result.push(network)
        }
      }
      obj.filteredNetworks = result;
    }
  }


  list(obj) {
    this.db.allDocs({ include_docs: true })
      .then((result) => {
        if (result.total_rows == 0) {
          this.init()
          setTimeout(() => this.list(obj), 1000)
        } else {
          obj.networks = result.rows
          this.filter(obj);
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  count() {
    this.db.allDocs()
      .then((result) => console.log(result.total_rows))
      .catch((err) => console.log(err));
  }

  load(obj, id) {
    obj['records'] = [];
    return this.db.get(id).then((doc) => {
      obj['data'] = this._dataService.clean(doc);
      window['data'] = obj['data'];
      this._protocolService.searchTerm = doc.name;
    })
  }

  save(data, addIfNotExist = false) {
    var data_cleaned = this._dataService.clean(data);
    this.db.get(data._id).then((doc) => {
      if (doc['hash'] == data_cleaned['hash']) return
      data_cleaned['_id'] = doc._id
      data_cleaned['_rev'] = doc._rev
      this.db.put(data_cleaned)
        .catch((err) => console.log(err));
    }).catch((err) => {
      console.log(err)
      if (addIfNotExist) {
        this.db.post(data_cleaned)
      }
    });
  }

  syncFromFile(filename) {
    var data = require('../../../../config/networks/' + filename + '.json');
    this.save(data, true);
  }

  init() {
    this.syncFromFile('neuronal-states');
    this.syncFromFile('spike-trains');
  }

}
