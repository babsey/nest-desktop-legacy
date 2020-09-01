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
  public viewCodeEditor: boolean = false;

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

  run(project: Project, force: boolean = false): Promise<any> {
    if (this.running) return
    if (!(force || this.config['runAfterChange'])) return

    this._logService.reset();

    if (!this.viewCodeEditor) {
      if (project.simulation.config['autoRandomSeed']) {
        this._logService.log('Randomize seed');
        const seed: number = Math.random() * 1000;
        project.simulation['randomSeed'] = parseInt(seed.toFixed(0));
      }
      project.code.generate();
    }

    this.running = true;
    if (this.config['showSnackBar']) {
      this._snackBarRef = this._snackBar.open('The simulation is running. Please wait.', null, {});
    }

    const url: string = project.app.nestServer.url;
    this._logService.log('Run simulation on server');

    const request: any = (!project.app.nestServer.simulatorVersion.startsWith('2.') || this.viewCodeEditor) ?
      this._http.post(url + '/exec', { source: project.code.script, return: 'response' }) :
      this._http.post(url + '/script/simulation/run', project.toJSON('simulator'));

    return new Promise((resolve, reject) => {
      request.subscribe(response => {
        this.running = false;
        if (this._snackBarRef) {
          this._snackBarRef.dismiss();
        }
        this._logService.log('Response from server')
        if (response.hasOwnProperty('stdout')) {
          this._snackBarRef = this._snackBar.open(response['stdout'], null, {
            duration: 5000
          });
        }
        project.updateActivities(response['data']);
        this._activityGraphService.update.emit();
        resolve();
      }, error => {
        this.running = false;
        if (this._snackBarRef) {
          this._snackBarRef.dismiss();
        }
        const message: string = error['error'];
        const url: string = 'https://nest-desktop.readthedocs.io/en/master/user/troubleshooting.html#error-messages';
        const link: string = '<br><br><a target="_blank" href="' + url + '">See documentation for details.</a>';
        this._toastr.error(message + link, null, {
          enableHtml: true,
          progressBar: true,
          timeOut: 5000,
          extendedTimeOut: 3000,
        });
        reject();
      })
    });
  }

}
