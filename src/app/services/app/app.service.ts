import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { App } from '../../components/app';
import { Project } from '../../components/project/project';


@Injectable({
  providedIn: 'root'
})
export class AppService {
  private _rightClick = false;
  private _app: App;
  private _change: EventEmitter<any> = new EventEmitter();
  private _sidenavOpened = false;

  constructor(
    private _snackBar: MatSnackBar,
  ) {
    this.app = new App();
  }

  get app(): App {
    return this._app;
  }

  set app(value: App) {
    this._app = value;
  }

  get change(): EventEmitter<any> {
    return this._change;
  }

  get rightClick(): boolean {
    return this._rightClick;
  }

  set rightClick(value: boolean) {
    this._rightClick = value;
  }

  get sidenavOpened(): boolean {
    return this._sidenavOpened;
  }

  set sidenavOpened(value: boolean) {
    this._sidenavOpened = value;
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  upload(projects: Project[]): void {
    // console.log('Upload projects')
    this.app.addProjects(projects).then((resp: any) => {
      this._snackBar.open('Projects uploaded successfully.', null, {
        duration: 2000,
      });
      this.change.emit();
    }).catch(err => {
      this._snackBar.open(err, 'Ok');
    });
  }

}
