import { Injectable, EventEmitter } from '@angular/core';

import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBUpsert from 'pouchdb-upsert/dist/pouchdb.upsert';

import { DataService } from '../data/data.service';
import { DBService } from '../db/db.service';

@Injectable({
  providedIn: 'root'
})
export class ProtocolService {
  public db: any;
  public searchTerm; string = '';
  public change: any = new EventEmitter;

  constructor(
    private _dataService: DataService,
    private _dbService: DBService,
  ) {
  }

  init() {
    this.db = this._dbService.PouchDB('protocols')
  }

  viewAll() {
    this.db.allDocs({ include_docs: true })
      .then((doc) => console.log(doc))
      .catch((err) => console.log(err));
  }

  filter(obj) {
    // https://stackblitz.com/edit/angular-material-mat-select-filter
    obj.filteredProtocols = obj.protocols;
    if (this.searchTerm) {
      let result: string[] = [];
      for (let protocol of obj.protocols) {
        if (protocol.doc.name.indexOf(this.searchTerm) > -1) {
          result.push(protocol)
        }
      }
      obj.filteredProtocols = result;
    }
  }

  list(obj) {
    this.db.allDocs({ include_docs: true })
      .then(result => {
        var protocols = result.rows;
        var sortedProtocols = protocols.sort((a:any, b:any) => {
          var dateB:any = new Date(b.doc.updatedAt);
          var dateA:any = new Date(a.doc.updatedAt);
          return dateB - dateA;
        } );
        obj.protocols = sortedProtocols;
        this.filter(obj);
      })
      .catch(err => console.log(err))
  }

  count() {
    return this.db.allDocs()
      .then(result => result.total_rows)
      .catch(err => err);
  }

  load(obj, id) {
    obj['records'] = [];
    return this.db.get(id).then(doc => {
      obj['data'] = this._dataService.clean(doc);
      this._dataService.options.ready = true;
    })
  }

  save(data) {
    var data_cleaned = this._dataService.clean(data);
    this.db.allDocs(
      {include_docs: true}
    ).then(docs => {
      var hash = docs.rows.map(row => row.doc.hash)
      if (hash.indexOf(data_cleaned['hash']) != -1) {
        this.db.get(data_cleaned['_id']).then(doc => {
          doc['name'] = data['name'];
          doc['collections'] = data['collections'];
          doc['updatedAt'] = new Date();
          this.db.put(doc).then(() => this.change.emit());
        })
      } else {
        delete data_cleaned['_id']
        data_cleaned['createdAt'] = new Date();
        data_cleaned['updatedAt'] = new Date();
        this.db.post(data_cleaned).then(() => this.change.emit());
      }
    })
  }



}
