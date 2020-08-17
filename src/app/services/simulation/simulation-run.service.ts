import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

import { Project } from '../../components/project/project';
import { Activity } from '../../components/activity/activity';

import { AppService } from '../app/app.service';
import { ActivityGraphService } from '../activity/activity-graph.service';
import { LogService } from '../log/log.service';


var STORAGE_NAME = 'simulation-config';

@Injectable({
  providedIn: 'root'
})
export class SimulationRunService {
  private _project: Project;
  private _snackBarRef: any;
  public config: Object = {
    runAfterLoad: true,
    runAfterChange: true,
    autoRandomSeed: false,
  }
  public running: boolean = false;
  public mode: string = 'declarative';

  constructor(
    private _activityGraphService: ActivityGraphService,
    private _appService: AppService,
    private _logService: LogService,
    private _http: HttpClient,
    private _snackBar: MatSnackBar,
    private _toastr: ToastrService,
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
    this._project = this._appService.data.project;

    if (this.config['autoRandomSeed']) {
      this._logService.log('Randomize seed');
      const seed: number = Math.random() * 1000;
      this._project.simulation['randomSeed'] = parseInt(seed.toFixed(0));
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
      this._snackBarRef = this._snackBar.open('The simulation is running. Please wait.', null, {});
    }

    (this.mode === 'declarative') ? this.runScript() : this.execCode();
  }

  runScript(): void {
    const urlRoot: string = this._appService.data.nestServer.url;
    this._logService.log('Run script on server');
    this.running = true;
    this._http.post(urlRoot + '/script/simulation/run', this._project.serialize('simulator'))
      .subscribe(data => this.response(data), err => this.error(err['error']))
  }

  execCode(): void {
    const urlRoot: string = this._appService.data.nestServer.url;
    this._logService.log('Exec code on server');
    this.running = true;
    this._http.post(urlRoot + '/exec', { source: this._project.code.script, return: 'response' })
      .subscribe(data => this.response(data), err => this.error(err['error']))
  }

  response(resp): void {
    this.running = false;
    if (resp['status'] == 'error') {
      const error = resp['error'];
      this.error(error['message'], error['title'])
    } else {
      if (this._snackBarRef) {
        this._snackBarRef.dismiss();
      }
      this._logService.logs = this._logService.logs.concat(resp['logs'] || []);
      this._logService.log('Response from server')
      if (resp['stdout']) {
        // console.log(resp['stdout'])
        this._snackBarRef = this._snackBar.open(resp['stdout'], null, {
        duration: 5000
        });
      }

      this._project.updateActivities(resp['data']);
      this._activityGraphService.update.emit();
    }
  }

  fetchElementTypes(idx: number): string[] {
    return this._project.network.connections
      .filter(connection => connection.source.idx === idx)
      .map(connection => connection.target.model.elementType);
  }

  listParams(idx: number, key: string = ''): any[] {
    var nodes = this._project.network.connections
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
    if (this._snackBarRef) {
      this._snackBarRef.dismiss();
    }
    var url = 'https://nest-desktop.readthedocs.io/en/master/user/troubleshooting.html#error-messages';
    var link = '<br><br><a target="_blank" href="' + url + '">See documentation for details.</a>';
    this._toastr.error(message + link, title, {
      enableHtml: true,
      progressBar: true,
      timeOut: 5000,
      extendedTimeOut: 3000,
    });
  }
}
