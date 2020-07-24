import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ToastrService } from 'ngx-toastr';

import { AppService } from '../../app.service';
import { AnimationControllerService } from '../../visualization/animation/animation-controller/animation-controller.service';
import { LogService } from '../../log/log.service';
import { NestServerService } from '../../nest-server/nest-server.service';

import { Project } from '../../components/project';
import { Activity } from '../../components/activity';


var STORAGE_NAME = 'simulation-config';

@Injectable({
  providedIn: 'root'
})
export class SimulationRunService {
  private project: Project;
  private snackBarRef: any;
  public config: Object = {
    runAfterLoad: true,
    runAfterChange: true,
    autoRandomSeed: false,
  }
  public running: boolean = false;
  public simulated: EventEmitter<any> = new EventEmitter();
  public mode: string = 'declarative';

  constructor(
    private _appService: AppService,
    private _animationControllerService: AnimationControllerService,
    private _logService: LogService,
    private _nestServerService: NestServerService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private toastr: ToastrService,
  ) {
    const configJSON: string = localStorage.getItem(STORAGE_NAME);
    if (configJSON) {
      this.config = JSON.parse(configJSON)
    } else {
      this.saveConfig()
    }
  }

  saveConfig(): void {
    const configJSON: string = JSON.stringify(this.config);
    localStorage.setItem(STORAGE_NAME, configJSON);
  }

  run(force: boolean = false): void {
    if (this.running) return
    if (!(force || this.config['runAfterChange'])) return

    this._logService.reset();
    this.project = this._appService.data.project;

    if (this.config['autoRandomSeed']) {
      this._logService.log('Randomize seed');
      const seed: number = Math.random() * 1000;
      this.project.simulation['randomSeed'] = parseInt(seed.toFixed(0));
    }

    // this._logService.log('Clean and hash project');
    // var clonedData = project.clone();
    // project.app.nodes.map(node => {
    //   var collection = clonedData.simulation.collections[node.idx];
    //   if (node.hasOwnProperty('params')) {
    //     Object.keys(node.params).map(paramKey => {
    //       var param = node.params[paramKey];
    //       if (param.hasOwnProperty('factors')) {
    //         param.factors.map(factor => {
    //           var fac = project.app.factors.find(f => f.id == factor);
    //           if (fac && collection.params.hasOwnProperty(paramKey)) {
    //             collection.params[paramKey] = collection.params[paramKey] * fac.value;
    //           }
    //         })
    //       }
    //     })
    //   }
    // })

    if (this.config['showSnackBar']) {
      this.snackBarRef = this.snackBar.open('The simulation is running. Please wait.', null, {});
    }

    (this.mode === 'declarative') ? this.runScript() : this.execCode();
  }

  runScript(): void {
    const urlRoot: string = this._appService.data.nestServer.url;
    this._logService.log('Run script on server');
    this.running = true;
    this.http.post(urlRoot + '/script/simulation/run', this.project.serialize('simulator'))
      .subscribe(data => this.response(data), err => this.error(err['error']))
  }

  execCode(): void {
    const urlRoot: string = this._appService.data.nestServer.url;
    this._logService.log('Exec code on server');
    this.running = true;
    this.http.post(urlRoot + '/exec', { source: this.project.code.script, return: 'response' })
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

      this.project.updateActivities(resp['data']);
      // console.log(this.project.activities)
      this.simulated.emit(resp['data'])
    }
  }

  fetchElementTypes(idx: number): string[] {
    return this.project.network.connections
      .filter(connection => connection.source.idx === idx)
      .map(connection => connection.target.model.elementType);
  }

  listParams(idx: number, key: string = ''): any[] {
    var nodes = this.project.network.connections
      .filter(connection => connection.source.idx === idx)
      .map(connection => connection.target);
    if (key) {
      return nodes
        .filter(node => node.params.find(param => param.id == key).visible)
        .map(node => node.params.find(param => param.id == key));
    }
    return nodes.map(nodes => nodes.params);
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
