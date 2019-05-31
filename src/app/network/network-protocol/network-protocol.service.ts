import { Injectable, EventEmitter } from '@angular/core';

import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBUpsert from 'pouchdb-upsert/dist/pouchdb.upsert';

import { DataService } from '../../services/data/data.service';
import { DBService } from '../../services/db/db.service';
import { NavigationService } from '../../navigation/navigation.service';


@Injectable({
  providedIn: 'root'
})
export class NetworkProtocolService {
  public db: any;
  public status: any = {
    loading: false,
    ready: false,
    valid: false,
  };
  public version: string;
  public change = new EventEmitter();

  constructor(
    private _dataService: DataService,
    private _dbService: DBService,
    private _navigationService: NavigationService,
  ) {
  }

  init() {
    this.db = this._dbService.init('network-protocol');
    this._dbService.checkVersion(this)
  }

  loadNetworks() {
    return this.list().then(networks => {
      networks.map(network => network['source'] = 'protocol')
      return networks;
    })
  }

  count() {
    return this._dbService.db.count(this.db)
  }

  list() {
    return this._dbService.db.list(this.db)
  }

  load(id) {
    return this._dbService.db.read(this.db, id).then(doc => {
      this._dataService['records'] = [];
      this._dataService['data'] = this._dataService.clean(doc);
      this._dataService.options.ready = true;
      return doc
    })
  }

  hashList() {
    return this.list().then(docs => docs.map(row => row.hash))
  }

  save(data) {
    let data_cleaned = this._dataService.clean(data);
    this.count().then(count => {
      if (count == 0) {
        if ('_id' in data_cleaned) {
          delete data_cleaned['_id']
        }
        this._dbService.db.create(this.db, data_cleaned)
          .then(res => {
            this._dataService.data['_id'] = res.id;
            this.change.emit()
          })
      } else {
        this.hashList().then(hash => {
          if (hash.indexOf(data_cleaned['hash']) != -1) {
            this._dbService.db.update(this.db, data_cleaned).then(res => {
              this.change.emit()
            })
          } else {
            if ('_id' in data_cleaned) {
              delete data_cleaned['_id']
            }
            this._dbService.db.create(this.db, data_cleaned)
              .then(res => {
                this._dataService.data['_id'] = res.id;
                this.change.emit()
              })
          }
        })
      }
    })
  }

  delete(id) {
    return this._dbService.db.delete(this.db, id)
  }

  deleteBulk(ids) {
    return this._dbService.db.deleteBulk(this.db, ids)
  }

  reset() {
    this.db.destroy().then(() => {
      this.init()
    })
  }
}
