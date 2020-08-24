import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

import { Project } from '../../components/project/project';
import { Activity } from '../../components/activity/activity';

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

  run(project: Project, force: boolean = false, mode: string = 'imperative'): Promise<any> {
    if (this.running) return
    if (!(force || this.config['runAfterChange'])) return

    this._logService.reset();

    if (this.config['autoRandomSeed']) {
      this._logService.log('Randomize seed');
      const seed: number = Math.random() * 1000;
      project.simulation['randomSeed'] = parseInt(seed.toFixed(0));
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

    const request: any = (mode === 'imperative') ? this.execCode(project) : this.runScript(project);
    return new Promise((resolve,reject) => {
      request.subscribe(data => {
        this.response(project, data);
        resolve(true);
      }, err => {
        this.error(err['error']);
        reject(true);
      })
    })
  }

  runScript(project: Project): any {
    const urlRoot: string = project.app.nestServer.url;
    this._logService.log('Run script on server');
    this.running = true;
    return this.http.post(urlRoot + '/script/simulation/run', project.serialize('simulator'))
  }

  execCode(project: Project): any {
    const urlRoot: string = project.app.nestServer.url;
    this._logService.log('Exec code on server');
    this.running = true;
    return this.http.post(urlRoot + '/exec', { source: project.code.script, return: 'response' })
  }

  response(project: Project, resp: any): void {
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

      project.updateActivities(resp['data']);
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
