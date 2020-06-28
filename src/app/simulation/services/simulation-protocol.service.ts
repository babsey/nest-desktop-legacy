import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from '../../../environments/environment';

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
    let dataCloned = data.clone();
    this.count().then(count => {
      if (count == 0) {
        if ('_id' in dataCloned) {
          delete dataCloned['_id']
          delete dataCloned['_rev']
        }
        // console.log('Create data in db')
        this._dbService.db.create(this.db, dataCloned)
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
          if (hash.indexOf(dataCloned['hash']) != -1 && dataCloned._id) {
            // console.log('Update data in db')
            this._dbService.db.update(this.db, dataCloned).then(res => {
              if (reload) {
                this.load(res.id).then(() => {
                  this.change.emit()
                })
              } else {
                this.change.emit()
              }
            })
          } else {
            if ('_id' in dataCloned) {
              delete dataCloned['_id']
              delete dataCloned['_rev']
            }
            // console.log('Create data in db')
            this._dbService.db.create(this.db, dataCloned)
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

  pad(num: number, size: number = 2): string {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  download(data: Data[]): void {
    data.forEach(d => d['_rev'] = undefined);
    var dataJSON = JSON.stringify(data);
    var element = document.createElement('a');
    element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(dataJSON));
    var now = new Date();
    var date = [now.getFullYear()-2000, this.pad(now.getMonth() + 1), this.pad(now.getDate())];
    var time = [this.pad(now.getHours()), this.pad(now.getMinutes()), this.pad(now.getSeconds())];
    var datetime = date.join('') + '_' + time.join('');
    element.setAttribute('download', "NEST_Desktop-" + datetime + "-protocols.json");
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
