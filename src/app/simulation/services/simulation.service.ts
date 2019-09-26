import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { environment } from '../../../environments/environment';

import { DataService } from '../../services/data/data.service';
import { DBService } from '../../services/db/db.service';
import { NavigationService } from '../../navigation/navigation.service';
import { SimulationConfigService } from '../simulation-config/simulation-config.service';
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
  public version: string;

  constructor(
    private _dataService: DataService,
    private _dbService: DBService,
    private _navigationService: NavigationService,
    private _simulationConfigService: SimulationConfigService,
    private _simulationProtocolService: SimulationProtocolService,
    private http: HttpClient,
  ) {
  }

  init() {
    this.status.ready = false;
    this._simulationProtocolService.status.ready = false;
    var config = this._simulationConfigService.config['db']['simulation'];
    this.db = this._dbService.init('simulation', config);
    this.initVersion()
    this.loadSimulations().then(simulations => {
      this._simulationProtocolService.loadSimulations().then(simulations => {
        this._simulationProtocolService.isValid(simulations.length);
      })
    })
  }

  loadSimulations() {
    return this.count().then(count => {
      this.isValid(count);
      if (count == 0) {
        var files = ['current-input', 'spike-input', 'spike-trains'];
        return this.fromFiles(files)
      } else {
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

  initVersion() {
    this._dbService.db.getVersion(this.db)
      .catch(() => this._dbService.db.setVersion(this.db, environment.VERSION)
        .then(version => this.version = version)
      ).then(version => this.version = version)
  }

  isValid(count) {
    if (count == 0) {
      this.status.valid = true;
    } else {
      var appVersion = environment.VERSION.split('.');
      var dbVersion = this.version.split('.');
      this.status.valid = appVersion[0] == dbVersion[0] && appVersion[1] == dbVersion[1];
    }
    this.status.ready = true;
  }

}
