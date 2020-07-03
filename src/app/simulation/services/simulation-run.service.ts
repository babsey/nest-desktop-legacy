import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ToastrService } from 'ngx-toastr';

import { AnimationControllerService } from '../../visualization/animation/animation-controller/animation-controller.service';
import { SimulationService } from '../services/simulation.service';
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
  public mode: string = 'object';

  constructor(
    private _animationControllerService: AnimationControllerService,
    private _simulationService: SimulationService,
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
      data.simulation['random_seed'] = parseInt(seed.toFixed(0));
    }

    this._logService.log('Clean and hash data');
    var clonedData = data.clone();
    data.app.nodes.map(node => {
      var collection = clonedData.simulation.collections[node.idx];
      if (node.hasOwnProperty('params')) {
        Object.keys(node.params).map(paramKey => {
          var param = node.params[paramKey];
          if (param.hasOwnProperty('factors')) {
            param.factors.map(factor => {
              var fac = data.app.factors.find(f => f.id == factor);
              if (fac && collection.params.hasOwnProperty(paramKey)) {
                collection.params[paramKey] = collection.params[paramKey] * fac.value;
              }
            })
          }
        })
      }
    })

    if (this.config['showSnackBar']) {
      this.snackBarRef = this.snackBar.open('The simulation is running. Please wait.', null, {});
    }

    // console.log(clonedData);
    (this.mode == 'object') ? this.run_object(clonedData) : this.run_code(clonedData);
  }

  run_object(data: Data): void {
    const urlRoot: string = this._nestServerService.url();
    this._logService.log('Object request to server');
    this.running = true;
    this.http.post(urlRoot + '/script/simulation/run', data.simulation)
      .subscribe(data => this.response(data), err => this.error(err['error']))
  }

  run_code(data: Data): void {
    const urlRoot: string = this._nestServerService.url();
    this._logService.log('Script request to server');
    let code: string = this._simulationService.code;
    this.running = true;
    this.http.post(urlRoot + '/exec', { source: code, return: 'response' })
      .subscribe(data => this.response(data), err => this.error(err['error']))
  }

  response(resp): void {
    this.running = false;
    if (resp['status'] == 'error') {
      const error = resp['error'];
      this.error(error['message'], error['title'])
    } else {
      if (this.snackBarRef) {
        this.snackBarRef.dismiss();
      }
      this._logService.logs = this._logService.logs.concat(resp['logs'] || []);
      this._logService.log('Response from server')
      if (resp['stdout']) {
        // console.log(resp['stdout'])
        this.snackBarRef = this.snackBar.open(resp['stdout'], null, {
        duration: 5000
        });
      }
      this.simulated.emit(resp['data'])
    }
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
