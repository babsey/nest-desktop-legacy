import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

import { Project } from '../../components/project/project';

import { LogService } from '../log/log.service';


@Injectable({
  providedIn: 'root'
})
export class SimulationRunService {
  private _snackBarRef: any;

  constructor(
    private _logService: LogService,
    private _snackBar: MatSnackBar,
    private _toastr: ToastrService,
  ) { }

  run(project: Project): Promise<any> {
    if (project.simulation.running) { return; }
    this._logService.reset();

    if (project.config.showSnackBar) {
      this._snackBarRef = this._snackBar.open('The simulation is running. Please wait.', null, {});
    }

    this._logService.log('Run simulation on server');
    const request: Promise<any> = project.runSimulation();

    return request.then((resp: any) => {
      if (this._snackBarRef) {
        this._snackBarRef.dismiss();
      }
      this._logService.log('Response from server');
      if (project.errorMessage !== '') {
        project.emptyActivityGraph();
        this.showError(project.errorMessage);
      }
      if (resp.hasOwnProperty('stdout')) {
        this._snackBarRef = this._snackBar.open(resp.stdout, null, {
          duration: 5000
        });
      }
    }).catch((err: any) => {
      console.log(err);
      if (this._snackBarRef) {
        this._snackBarRef.dismiss();
      }
      const message: string = err.error;
      this.showError(message);
    });
  }

  showError(message: string): void {
    const docUrl = 'https://nest-desktop.readthedocs.io/en/master/user/troubleshooting.html#error-messages';
    const link: string = '<br><br><a target="_blank" href="' + docUrl + '">See documentation for details.</a>';
    this._toastr.error(message + link, null, {
      enableHtml: true,
      progressBar: true,
      timeOut: 5000,
      extendedTimeOut: 3000,
    });
  }

}
