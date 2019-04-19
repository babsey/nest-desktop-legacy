import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

import { AppConfigService } from '../../config/app-config/app-config.service';
import { ChartConfigService } from '../../config/chart-config/chart-config.service';
import { ChartService } from '../../chart/chart.service';
import { DataService } from '../../services/data/data.service';
import { LogService } from '../../log/log.service';
import { NetworkProtocolService } from '../network-protocol/network-protocol.service';
import { SketchService } from '../../sketch/sketch.service';

var STORAGE_NAME = 'simulation-config';

@Injectable({
  providedIn: 'root'
})
export class NetworkSimulationService {
  private snackBarRef: any;
  public config: Object = {
    autoSimulation: true,
    autoProtocol: false,
    autoRandomSeed: false,
  }
  public resize = new EventEmitter();
  public sidenavListOpened: boolean = false;
  public simulating: boolean = false;

  constructor(
    private _appConfigService: AppConfigService,
    private _chartConfigService: ChartConfigService,
    private _chartService: ChartService,
    private _dataService: DataService,
    private _logService: LogService,
    private _networkProtocolService: NetworkProtocolService,
    private _sketchService: SketchService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
  ) {
    let configJSON = localStorage.getItem(STORAGE_NAME);
    if (configJSON) {
      this.config = JSON.parse(configJSON)
    } else {
      this.saveConfig()
    }
  }

  saveConfig() {
    let configJSON = JSON.stringify(this.config);
    localStorage.setItem(STORAGE_NAME, configJSON);
  }

  run(force = false) {
    if (this.simulating) return
    // console.log('Run simulation')
    if (!(force || this.config['autoSimulation'])) return
    if (this._sketchService.options.drawing) return
    var urlRoot = this._appConfigService.urlRoot();

    this._logService.reset()

    if (this.config['autoRandomSeed']) {
      this._logService.log('Randomize seed');
      let seed = Math.random() * 1000;
      this._dataService.data.simulation['random_seed'] = seed.toFixed(0);
    }
    var data_cleaned = this._dataService.clean(this._dataService.data);

    this._logService.log('Clean and hash data');
    this._dataService.data['hash'] = data_cleaned['hash'];
    this._dataService.history(this._dataService.data)
    this._chartService.selected = [];

    this.snackBarRef = this.snackBar.open('The simulation is running. Please wait.', null, {});
    this._logService.log('Request to server');
    this.simulating = true;
    this.http.post(urlRoot + '/simulate', data_cleaned).subscribe(res => {
      this.simulating = false;
      if ('error' in res) {
        this.snackBarRef = this.snackBar.open(res['error'], 'Ok');
      } else {
        this._logService.logs = this._logService.logs.concat(res['data'].logs || []);
        this._logService.log('Response from server')
        if (this.snackBarRef) {
          this.snackBarRef.dismiss();
        }
        if (this.config['autoProtocol']) {
          this._networkProtocolService.save(this._dataService.data)
        }
        let time = res['data'].kernel.time;
        this._dataService.data.kernel['time'] = time;
        res['data'].collections.map((collection, idx) => {
          this._dataService.data.collections[idx]['global_ids'] = collection.global_ids;
          let params = this._dataService.data.models[collection.model].params;
          if ('record_from' in params) {
            this._dataService.data.collections[idx]['record_from'] = params.record_from;
          }
          if ('topology' in collection) {
            this._dataService.data.collections[idx].topology['positions'] = collection.topology.positions;
          }
        })
        this._logService.log('Update record data')
        res['data'].records.map(record => {
          if (this._dataService['records'].length <= record.idx) {
            this._dataService['records'].push(record)
          } else if (this._dataService['records'][record.idx].recorder.model != record.recorder.model) {
            this._dataService['records'][record.idx] = record;
          } else {
            this._dataService['records'][record.idx].events = record.events;
          }
        })
        if (this._chartConfigService.config.resetScale) {
          this._chartService.yAutoscale = true;
          this._chartService.xAutoscale = true;
        }
        if (this._chartService.xAutoscale) {
          this._logService.log('Autoscale x-axis')
          this._chartService.xScale.domain([0, time || 1000.]);
        }
        this._chartService.init.emit()
      }
    },
      error => {
        this.simulating = false;
        console.log(error['error'])
        this.snackBarRef = this.snackBar.open('Simulation failed. NEST Server not found. Please check the configuration.', 'Ok');
      }
    )
  }
}
