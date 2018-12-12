import { Injectable } from '@angular/core';

import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBUpsert from 'pouchdb-upsert/dist/pouchdb.upsert';

import { DataService } from '../data/data.service';
import { DBService } from '../db/db.service';

declare function require(url: string);

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  public db: any;
  public searchTerm; string = '';

  constructor(
    private _dataService: DataService,
    private _dbService: DBService,
  ) {
  }

  init() {
    this.db = this._dbService.PouchDB('networks')
    this.syncFromFile('neuronal-states');
    this.syncFromFile('spike-trains');
  }

  syncFromFile(filename) {
    var data = require('../../../config/networks/' + filename + '.json');
    this.save(data, true);
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
      this._dataService.options.ready = true;
    })
  }

  save(data, addIfNotExist = false) {
    var data_cleaned = this._dataService.clean(data);
    this.db.get(data._id).then((doc) => {
      if (doc['hash'] == data_cleaned['hash']) return
      data_cleaned['_id'] = doc._id
      this.db.put(data_cleaned)
        .catch((err) => console.log(err));
    }).catch((err) => {
      console.log(err)
      if (addIfNotExist) {
        this.db.post(data_cleaned)
      }
    });
  }
}
