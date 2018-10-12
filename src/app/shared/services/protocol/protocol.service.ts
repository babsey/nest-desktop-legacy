import { Injectable } from '@angular/core';

import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBUpsert from 'pouchdb-upsert/dist/pouchdb.upsert';

import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class ProtocolService {
  public db: any;
  public searchTerm; string = '';

  constructor(
    private _dataService: DataService,
  ) {
    this.db = new PouchDB('protocols');
    // this.db.destroy()
    // this.viewAll()
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
      .then((result) => {
        var protocols = result.rows;
        var sortedProtocols = protocols.sort((a:any, b:any) => {
          var dateB:any = new Date(b.doc.updatedAt);
          var dateA:any = new Date(a.doc.updatedAt);
          return dateB - dateA;
        } );
        obj.protocols = sortedProtocols;
        this.filter(obj);
      })
      .catch((err) => console.log(err))
  }

  count() {
    this.db.allDocs()
      .then((result) => console.log(result.total_rows))
      .catch((err) => console.log(err));
  }

  load(obj, id) {
    obj['records'] = [];
    return this.db.get(id).then((doc) => {
      obj['data'] = doc;
      window['data'] = doc;
    })
  }

  save(data) {
    var data_cleaned = this._dataService.clean(data);
    this.db.allDocs(
      {include_docs: true}
    ).then((docs) => {
      var hash = docs.rows.map((row) => row.doc.hash)
      if (hash.indexOf(data_cleaned['hash']) != -1) {
        data_cleaned['_id'] = data._id;
        data_cleaned['_rev'] = data._rev;
        data_cleaned['updatedAt'] = new Date();
        this.db.put(data_cleaned)
      } else {
        data_cleaned['createdAt'] = new Date();
        data_cleaned['updatedAt'] = new Date();
        this.db.post(data_cleaned)
      }
    })
  }

}
