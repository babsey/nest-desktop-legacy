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
    window['networks'] = this
    this.db = this._dbService.init('networks')
    this.syncFromFile('neuronal-states');
    this.syncFromFile('spike-trains');
  }

  syncFromFile(filename) {
    var data = require('../../../config/networks/' + filename + '.json');
    let data_cleaned = this._dataService.clean(data);
    this._dbService.hashDocs(this.db)
      .then(docsHash => {
        if (docsHash.indexOf(data_cleaned['hash']) == -1) {
          this.save(data_cleaned);
        }
      })
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
    this._dbService.countDocs(this.db).then(count => {
      if (count == 0) {
        this.init()
        setTimeout(() => this.list(obj), 1000)
      } else {
        this._dbService.listDocs(this.db).then(docs => {
          obj.networks = docs.sort(this._dbService.sortByProperty('name'));
          this.filter(obj);
        })
      }
    })
  }

  count() {
    return this._dbService.countDocs(this.db)
  }

  load(id) {
    return this._dbService.loadDoc(this.db, id)
  }

  save(data) {
    return this._dbService.saveDoc(this.db, data)
  }
}
