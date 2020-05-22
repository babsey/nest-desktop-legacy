import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ToastrService } from 'ngx-toastr';

import { AnimationControllerService } from '../../visualization/animation/animation-controller/animation-controller.service';
import { DataService } from '../../services/data/data.service';
import { LogService } from '../../log/log.service';
import { NestServerService } from '../../nest-server/nest-server.service';

import { Data } from '../../classes/data';


var STORAGE_NAME = 'simulation-config';

@Injectable({
  providedIn: 'root'
})
export class SimulationRunService {
  private snackBarRef: any;
  public config: Object = {
    runAfterLoad: true,
    runAfterChange: true,
    autoRandomSeed: false,
  }
  public running: boolean = false;
  public simulated: EventEmitter<any> = new EventEmitter();

  constructor(
    private _animationControllerService: AnimationControllerService,
    private _dataService: DataService,
    private _logService: LogService,
    private _nestServerService: NestServerService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private toastr: ToastrService,
  ) {
    let configJSON = localStorage.getItem(STORAGE_NAME);
    if (configJSON) {
      this.config = JSON.parse(configJSON)
    } else {
      this.saveConfig()
    }
  }

  saveConfig(): void {
    let configJSON = JSON.stringify(this.config);
    localStorage.setItem(STORAGE_NAME, configJSON);
  }

  run(data: Data, force: boolean = false): void {
    if (this.running) return
    // console.log('Run simulation')
    if (!(force || this.config['runAfterChange'])) return

    var urlRoot = this._nestServerService.url();
    this._logService.reset()

    if (this.config['autoRandomSeed']) {
      this._logService.log('Randomize seed');
      let seed = Math.random() * 1000;
      data.simulation['random_seed'] = seed.toFixed(0);
    }

    this._logService.log('Clean and hash data');
    var data_cleaned = this._dataService.clean(data);

    data.app.nodes.map(node => {
      var collection = data_cleaned.simulation.collections[node.idx];
      var simModel = data_cleaned.simulation.models[collection.model];
      if (node.hasOwnProperty('params')) {
        Object.keys(node.params).map(paramKey => {
          var param = node.params[paramKey];
          if (param.hasOwnProperty('factors')) {
            param.factors.map(factor => {
              var fac = data.app.factors.find(f => f.id == factor);

              if (fac && simModel.params.hasOwnProperty(paramKey)) {
                simModel.params[paramKey] = simModel.params[paramKey] * fac.value;
              }
            })
          }
        })
      }
    })

    this.snackBarRef = this.snackBar.open('The simulation is running. Please wait.', null, {});
    this._logService.log('Request to server');
    this.running = true;
    this.http.post(urlRoot + '/script/simulation/run', data_cleaned.simulation, { observe: 'response' }).subscribe(resp => {
      this.running = false;
      if (this.snackBarRef) {
        this.snackBarRef.dismiss();
      }
      this._logService.logs = this._logService.logs.concat(resp['body']['logs'] || []);
      this._logService.log('Response from server')
      this.simulated.emit(resp['body']['data'])
    }, err => {
      console.log(err)
      if (typeof err['error'] == 'string') {
        this.error(err['error'], err['statusText'])
      } else {
        this.error('Server not found.')
      }
    })
  }

  error(message: string, title: string = null): void {
    this.running = false;
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
    var url = 'https://nest-desktop.readthedocs.io/en/master/user/troubleshooting.html#error-messages';
    var link = '<br><br><a target="_blank" href="' + url + '">See documentation for details.</a>';
    this.toastr.error(message + link, title, {
      enableHtml: true,
      progressBar: true,
      timeOut: 5000,
      extendedTimeOut: 3000,
    });
  }
}
