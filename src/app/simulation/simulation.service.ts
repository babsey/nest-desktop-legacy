import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

import { ControllerService } from '../controller/controller.service';
import { ChartService } from '../chart/chart.service';
import { ConfigService } from '../config/config.service';
import { DataService } from '../services/data/data.service';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private snackBarRef: any;
  public sidenavListOpened: any = false;

  constructor(
    private _chartService: ChartService,
    private _controllerService: ControllerService,
    private _configService: ConfigService,
    private _dataService: DataService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
  ) { }

  run(force=false) {
    // console.log('Run simulation')
    if (this._controllerService.options.edit) return

    if (!this._configService.config.app.simulation.autoSimulation && !force) return
    var urlRoot = this._configService.urlRoot();

    if (this._configService.config.app.simulation.randomSeed) {
      let seed = Math.random() * 1000;
      this._dataService.data.simulation['random_seed'] = seed.toFixed(0);
    }
    var data_cleaned = this._dataService.clean(this._dataService.data);
    this._dataService.data['hash'] = data_cleaned['hash'];
    this._dataService.history(this._dataService.data)
    
    this.snackBarRef = this.snackBar.open('The simulation is running. Please wait.', null, {});
    // if (resetChart) {
    //   this._dataService['records'] = [];
    // }
    this.http.post(urlRoot + '/simulate', data_cleaned).subscribe(res => {
      if ('error' in res) {
        this.snackBarRef = this.snackBar.open(res['error'], 'Ok');
      } else {
        if (this.snackBarRef) {
          this.snackBarRef.dismiss();
        }
        let time = res['data'].kernel.time
        this._dataService.data.kernel['time'] = time;
        res['data'].collections.forEach((collection, idx) => {
          this._dataService.data.collections[idx]['global_ids'] = collection.global_ids;
        })
        res['data'].records.forEach(record => {
          if (this._dataService['records'].length <= record.idx) {
            this._dataService['records'].push(record)
          } else if (this._dataService['records'][record.idx].recorder.model != record.recorder.model) {
            this._dataService['records'][record.idx] = record;
          } else {
            this._dataService['records'][record.idx].events = record.events;
          }
        })
        // this._chartService.xAutoscale = true;
        // this._chartService.yAutoscale = true;
        if (this._chartService.xAutoscale) {
          this._chartService.xScale.domain([0, time || 1000.]);
        }
        this._chartService.init.emit()
        window['data'] = this._dataService.data;
      }
    },
      error => {
        console.log(error['error'])
        this.snackBarRef = this.snackBar.open('Simulation failed. NEST Server not found. Plase check the configuration.', 'Ok');
      }
    )
  }
}
