import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { environment } from '../../../environments/environment';

import { DataService } from '../../services/data/data.service';
import { DBService } from '../../services/db/db.service';
import { NavigationService } from '../../navigation/navigation.service';
import { SimulationConfigService } from '../simulation-config/simulation-config.service';
import { NetworkService } from '../../network/services/network.service';

import { Data } from '../../classes/data';


@Injectable({
  providedIn: 'root'
})
export class SimulationProtocolService {
  public db: any;
  public status: any = {
    ready: false,
    valid: false,
  };
  public version: string;
  public change: EventEmitter<any> = new EventEmitter();

  constructor(
    private _dataService: DataService,
    private _dbService: DBService,
    private _navigationService: NavigationService,
    private _networkService: NetworkService,
    private _simulationConfigService: SimulationConfigService,
    private snackBar: MatSnackBar,
  ) {
  }

  init(): void {
    var config = this._simulationConfigService.config['db']['protocol'];
    this.db = this._dbService.init('protocol', config);
    this.initVersion()
  }

  loadSimulations(): any {
    return this.list().then(simulations => {
      simulations.map(simulation => simulation['source'] = 'protocol')
      return simulations;
    })
  }

  count(): any {
    return this._dbService.db.count(this.db);
  }

  list(): any {
    return this._dbService.db.list(this.db);
  }

  load(id: string): any {
    // console.log('Load protocol')
    return this._dbService.db.read(this.db, id)
  }

  hashList(): any {
    return this.list().then(docs => docs.map(row => row.hash));
  }

  save(data: Data, reload: boolean = false): void {
    // console.log('Save protocol')
    let data_cleaned = this._dataService.clean(data);
    this._networkService.validate(data_cleaned);
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

  delete(id: string): any {
    return this._dbService.db.delete(this.db, id);
  }

  deleteBulk(ids: string[]): any {
    return this._dbService.db.deleteBulk(this.db, ids);
  }

  reset(): void {
    this.db.destroy().then(() => {
      this.init()
    })
  }

  download(data: Data[]): void {
    if (data.hasOwnProperty('_rev')) {
      delete data['_rev'];
    } else {
      data.forEach(d => d['_rev'] = undefined);
    }
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

  upload(data: Data[]): void {
    var config = this._simulationConfigService.config.db.protocol;
    config['host'] = "";
    config['port'] = "";
    this.db = this._dbService.init('protocol', config);
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
