import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBUpsert from 'pouchdb-upsert/dist/pouchdb.upsert';

import { environment } from '../../../environments/environment';

import { DataService } from '../../services/data/data.service';
import { DBService } from '../../services/db/db.service';
import { DBVersionService } from '../../services/db/db-version/db-version.service';
import { NavigationService } from '../../navigation/navigation.service';
import { SimulationProtocolService } from './simulation-protocol.service';


@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  public db: any;
  public status: any = {
    ready: false,
    valid: false,
  };
  public mode: string = 'view';
  public version: any;

  constructor(
    private _dataService: DataService,
    private _dbService: DBService,
    private _dbVersionService: DBVersionService,
    private _navigationService: NavigationService,
    private _simulationProtocolService: SimulationProtocolService,
    private http: HttpClient,
  ) {
  }

  init() {
    this.status.ready = false;
    this._simulationProtocolService.status.ready = false;
    this.db = this._dbService.init('simulation');
    this._dbVersionService.init(this);
    this.loadSimulations().then(simulations => {
      this.status.ready = true;
      this._simulationProtocolService.loadSimulations().then(simulations => {
        if (simulations.length == 0) {
          this._simulationProtocolService.status.valid = true;
        } else {
          this._simulationProtocolService.status.valid = this._dbVersionService.isValid(this.version);
        }
        this._simulationProtocolService.status.ready = true;
      })
    })
  }

  loadSimulations() {
    return this.count().then(count => {
      if (count == 0) {
        this.status.valid = true;
        var files = ['current-input', 'spike-input', 'spike-trains'];
        return this.fromFiles(files)
      } else {
        this.status.valid = this._dbVersionService.isValid(this.version);
        return this.list().then(simulations => {
          simulations.map(simulation => simulation['source'] = 'simulation')
          return simulations;
        })
      }
    })
  }

  fromFiles(filenames) {
    var simulations = [];
    var files = filenames.map(filename => this.http.get('/assets/simulations/' + filename + '.json'))
    forkJoin(files).subscribe(simulations => {
      simulations.map(simulation => {
        simulation['version'] = environment.VERSION;
        let simulation_cleaned = this._dataService.clean(simulation);
        simulations.push(simulation_cleaned);
        this._dbService.db.create(this.db, simulation_cleaned)
      })
    })
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
