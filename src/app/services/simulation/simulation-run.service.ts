import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

import { Project } from '../../components/project/project';
import { Activity } from '../../components/activity/activity';

import { LogService } from '../log/log.service';


@Injectable({
  providedIn: 'root'
})
export class SimulationRunService {
  private _project: Project;
  private _snackBarRef: any;
  private _running = false;
  private _viewCodeEditor = false;

  constructor(
    private _logService: LogService,
    private _http: HttpClient,
    private _snackBar: MatSnackBar,
    private _toastr: ToastrService,
  ) { }

  get running(): boolean {
    return this._running;
  }

  set viewCodeEditor(value: boolean) {
    this._viewCodeEditor = value;
  }

  run(project: Project, force: boolean = false): Promise<any> {
    if (this.running) { return; }
    if (!(force || project.config.runAfterChange)) { return; }

    this._logService.reset();

    if (!this._viewCodeEditor) {
      if (project.simulation.config.autoRandomSeed) {
        this._logService.log('Randomize seed');
        const seed: number = Math.random() * 1000;
        project.simulation.randomSeed = parseInt(seed.toFixed(0), 0);
      }
      project.code.generate();
    }

    this._running = true;
    if (project.config.showSnackBar) {
      this._snackBarRef = this._snackBar.open('The simulation is running. Please wait.', null, {});
    }

    const url: string = project.app.nestServer.url;
    this._logService.log('Run simulation on server');

    const request: any = (!project.app.nestServer.state.simulatorVersion.startsWith('2.') || this._viewCodeEditor) ?
      this._http.post(url + '/exec', { source: project.code.script, return: 'response' }) :
      this._http.post(url + '/script/simulation/run', project.toJSON('simulator'));

    return new Promise((resolve, reject) => {
      request.subscribe((resp: any) => {
        this._running = false;
        if (this._snackBarRef) {
          this._snackBarRef.dismiss();
        }
        this._logService.log('Response from server');
        if (resp.hasOwnProperty('stdout')) {
          this._snackBarRef = this._snackBar.open(resp['stdout'], null, {
            duration: 5000
          });
        }
        project.updateActivities(resp['data']);
        resolve();
      }, (err: any) => {
        this._running = false;
        if (this._snackBarRef) {
          this._snackBarRef.dismiss();
        }
        const message: string = err['error'];
        const docUrl = 'https://nest-desktop.readthedocs.io/en/master/user/troubleshooting.html#error-messages';
        const link: string = '<br><br><a target="_blank" href="' + docUrl + '">See documentation for details.</a>';
        this._toastr.error(message + link, null, {
          enableHtml: true,
          progressBar: true,
          timeOut: 5000,
          extendedTimeOut: 3000,
        });
        reject();
      });
    });
  }

}
