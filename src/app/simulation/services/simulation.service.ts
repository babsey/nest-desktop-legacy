import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { environment } from '../../../environments/environment';

import { DataService } from '../../services/data/data.service';
import { DBService } from '../../services/db/db.service';
import { NavigationService } from '../../navigation/navigation.service';
import { NetworkService } from '../../network/services/network.service';
import { SimulationConfigService } from '../simulation-config/simulation-config.service';
import { SimulationProtocolService } from './simulation-protocol.service';

import { Data } from '../../classes/data';


@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  public data: Data;
  public dataLoaded: boolean = false;
  public db: any;
  public mode: string = 'details';
  public sidenavOpened: boolean = false;
  public version: string;
  public status: any = {
    ready: false,
    valid: false,
  };

  constructor(
    private _dataService: DataService,
    private _dbService: DBService,
    private _navigationService: NavigationService,
    private _networkService: NetworkService,
    private _simulationConfigService: SimulationConfigService,
    private _simulationProtocolService: SimulationProtocolService,
    private http: HttpClient,
  ) {
    this.data = this._dataService.newData();
  }

  init(): void {
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

  loadSimulations(): any {
    return this.count().then(count => {
      this.isValid(count);
      if (count == 0) {
        var files = [
          'spatial-spike-activity',
          'spatial-neurons',
          'spike-activity',
          'spike-input',
          'current-input',
        ];
        return this.fromFiles(files)
      } else {
        return this.list().then(simulations => {
          simulations.map(simulation => simulation['source'] = 'simulation')
          return simulations;
        })
      }
    })
  }

  fromFiles(filenames: string[]): Data[] {
    var simulations = [];
    var files = filenames.map(filename => this.http.get('/assets/simulations/' + filename + '.json'))
    forkJoin(files).subscribe(simulations => {
      simulations.map(simulation => {
        simulation['version'] = environment.VERSION;
        let simulation_cleaned = this._dataService.clean(simulation);
        this._networkService.validate(simulation_cleaned);
        simulations.push(simulation_cleaned);
        this._dbService.db.create(this.db, simulation_cleaned)
      })
    })
    return simulations;
  }

  count(): any {
    return this._dbService.db.count(this.db)
  }

  list(): any {
    return this._dbService.db.list(this.db)
  }

  load(id: string): any {
    // console.log('Load simulation')
    return this._dbService.db.read(this.db, id).then(doc => {
      return doc.error ? this._simulationProtocolService.load(id) : doc;
    })
  }

  hashList(): any {
    return this.list().then(docs => docs.map(row => row.hash))
  }

  save(data: Data): void {
    // console.log('Save simulation')
    let data_cleaned = this._dataService.clean(data);
    this._networkService.validate(data_cleaned);
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

  reset(): void {
    this.db.destroy().then(() => {
      this.init()
    })
  }

  initVersion(): void {
    this._dbService.db.getVersion(this.db)
      .catch(() => this._dbService.db.setVersion(this.db, environment.VERSION)
        .then(version => this.version = version)
      ).then(version => this.version = version)
  }

  isValid(count: number): void {
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
