import { Injectable } from '@angular/core';

import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBUpsert from 'pouchdb-upsert/dist/pouchdb.upsert';

import { environment } from '../../../environments/environment';

import { DataService } from '../../services/data/data.service';
import { DBService } from '../../services/db/db.service';
import { NavigationService } from '../../navigation/navigation.service';
import { SimulationProtocolService } from './simulation-protocol.service';


@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  public db: any;
  public status: any = {
    loading: false,
    ready: false,
    valid: false,
  };
  public mode: string = 'view';
  public version: string;

  constructor(
    private _dataService: DataService,
    private _dbService: DBService,
    private _navigationService: NavigationService,
    private _simulationProtocolService: SimulationProtocolService,
  ) {
  }

  init() {
    this.status.ready = false;
    this.status.loading = true;
    this.db = this._dbService.init('simulation');
    this._dbService.checkVersion(this)
    this.loadSimulations().then(simulations => {
      this.status.loading = false;
      this.status.ready = true;
      this.status.valid = this.version == environment.VERSION;
      this._simulationProtocolService.status.loading = true;
      this._simulationProtocolService.status.ready = false;
      this._simulationProtocolService.loadSimulations().then(simulations => {
        this._simulationProtocolService.status.loading = false;
        this._simulationProtocolService.status.ready = true;
        this._simulationProtocolService.status.valid = this._simulationProtocolService.version == environment.VERSION;
      })
    })
  }

  loadSimulations() {
    return this.count().then(count => {
      if (count == 0) {
        return this.fromFiles()
      } else {
        return this.list().then(simulations => {
          simulations.map(simulation => simulation['source'] = 'simulation')
          return simulations;
        })
      }
    })
  }

  fromFiles() {
    var files = ['current-input', 'spike-input', 'spike-trains'];
    var simulations = [];
    for (var idx in files) {
      var filename = files[idx];
      var data = require('../simulations/' + filename + '.json');
      data['version'] = environment.VERSION;
      let data_cleaned = this._dataService.clean(data);
      simulations.push(data_cleaned);
      this._dbService.db.create(this.db, data_cleaned)
    }
    return simulations;
  }

  count() {
    return this._dbService.db.count(this.db)
  }

  list() {
    return this._dbService.db.list(this.db)
  }

  load(id) {
    // console.log('Load simulation')
    return this._dbService.db.read(this.db, id).then(doc => {
      return doc.error ? this._simulationProtocolService.load(id) : doc;
    })
  }

  hashList() {
    return this.list().then(docs => docs.map(row => row.hash))
  }

  save(data) {
    // console.log('Save simulation')
    let data_cleaned = this._dataService.clean(data);
    return this.count().then(count => {
      if (count == 0) {
        return this._dbService.db.create(this.db, data_cleaned)
          .then(res => {
            data['_id'] = res.id;
          })
      } else {
        this.hashList().then(hash => {
          if (hash.indexOf(data_cleaned['hash']) != -1) {
            return this._dbService.db.update(this.db, data_cleaned)
          } else {
            return this._dbService.db.create(this.db, data_cleaned).then(res => {
              data['_id'] = res.id;
            })
          }
        })
      }
    })
  }

  reset() {
    this.db.destroy().then(() => {
      this.init()
    })
  }

}
