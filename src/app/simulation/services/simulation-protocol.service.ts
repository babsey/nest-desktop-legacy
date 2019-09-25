import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBUpsert from 'pouchdb-upsert/dist/pouchdb.upsert';

import { DataService } from '../../services/data/data.service';
import { DBConfigService } from '../../config/db-config/db-config.service';
import { DBService } from '../../services/db/db.service';
import { DBVersionService } from '../../services/db/db-version/db-version.service';
import { NavigationService } from '../../navigation/navigation.service';


@Injectable({
  providedIn: 'root'
})
export class SimulationProtocolService {
  public db: any;
  public status: any = {
    ready: false,
    valid: false,
  };
  public version: any;
  public change: EventEmitter<any> = new EventEmitter();

  constructor(
    private _dataService: DataService,
    private _dbConfigService: DBConfigService,
    private _dbService: DBService,
    private _dbVersionService: DBVersionService,
    private _navigationService: NavigationService,
    private snackBar: MatSnackBar,
  ) {
  }

  init() {
    this.db = this._dbService.init('protocol');
    this._dbVersionService.init(this);
  }

  loadSimulations() {
    return this.list().then(simulations => {
      simulations.map(simulation => simulation['source'] = 'protocol')
      return simulations;
    })
  }

  count() {
    return this._dbService.db.count(this.db);
  }

  list() {
    return this._dbService.db.list(this.db);
  }

  load(id) {
    // console.log('Load protocol')
    return this._dbService.db.read(this.db, id)
  }

  hashList() {
    return this.list().then(docs => docs.map(row => row.hash));
  }

  save(data, reload = false) {
    // console.log('Save protocol')
    let data_cleaned = this._dataService.clean(data);
    this.count().then(count => {
      if (count == 0) {
        if ('_id' in data_cleaned) {
          delete data_cleaned['_id']
          delete data_cleaned['_rev']
        }
        this._dbService.db.create(this.db, data_cleaned)
          .then(res => {
            if (reload) {
              this.load(res.id).then(() => {
                this.change.emit()
              })
            } else {
              data['_id'] = res.id;
              this.change.emit()
            }
          })
      } else {
        this.hashList().then(hash => {
          if (hash.indexOf(data_cleaned['hash']) != -1 && data_cleaned._id) {
            this._dbService.db.update(this.db, data_cleaned).then(res => {
              if (reload) {
                this.load(res.id).then(() => {
                  this.change.emit()
                })
              } else {
                this.change.emit()
              }
            })
          } else {
            if ('_id' in data_cleaned) {
              delete data_cleaned['_id']
              delete data_cleaned['_rev']
            }
            this._dbService.db.create(this.db, data_cleaned)
              .then(res => {
                if (reload) {
                  this.load(res.id).then(() => {
                    this.change.emit()
                  })
                } else {
                  data['_id'] = res.id;
                  this.change.emit()
                }
              })
          }
        })
      }
    })
  }

  delete(id) {
    return this._dbService.db.delete(this.db, id);
  }

  deleteBulk(ids) {
    return this._dbService.db.deleteBulk(this.db, ids);
  }

  reset() {
    this.db.destroy().then(() => {
      this.init()
    })
  }

  download(data) {
    delete data['_rev'];
    data.forEach(d => d['_rev'] = undefined)
    var dataJSON = JSON.stringify(data);
    var element = document.createElement('a');
    element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(dataJSON));
    var now = new Date().toLocaleString();
    element.setAttribute('download', "Protocols_" + now + ".json");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  upload(data) {
    var protocolDBConfig = this._dbConfigService.config['protocol'];
    protocolDBConfig['host'] = "";
    protocolDBConfig['port'] = "";
    this.db = this._dbService.init('protocol');
    this.db.bulkDocs(data, (err, response) => {
      if (err) {
        this.snackBar.open(err, 'Ok');
      } else {
        this.snackBar.open('Protocols uploaded successfully.', null, {
          duration: 2000,
        });
        this.change.emit()
      }
    });
  }
}
