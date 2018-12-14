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
    window['protocols'] = this
    this.db = this._dbService.init('protocols');
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
    this._dbService.countDocs(this.db).then(count => {
      if (count == 0) {
        this.init()
        setTimeout(() => this.list(obj), 1000)
      } else {
        this._dbService.listDocs(this.db).then(docs => {
          obj.protocols = docs.sort(this._dbService.sortByDate('updatedAt'));
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

  delete(id) {
    return this._dbService.deleteDoc(this.db, id)
  }

}
