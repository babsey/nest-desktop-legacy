import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { App } from '../../components/app';
import { Project } from '../../components/project/project';


@Injectable({
  providedIn: 'root'
})
export class AppService {
  public rightClick: boolean = false;
  public app: App;
  public change: EventEmitter<any> = new EventEmitter();
  public sidenavOpened: boolean = false;

  constructor(
    private _snackBar: MatSnackBar,
  ) {}

  get config(): any {
    return this.app === undefined ? {} : this.app.config;
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

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

}
