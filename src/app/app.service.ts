import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { App } from './components/app';
import { Project } from './components/project';


@Injectable({
  providedIn: 'root'
})
export class AppService {
  public rightClick: boolean = false;
  public data: App;
  public change: EventEmitter<any> = new EventEmitter();

  constructor(
    private snackBar: MatSnackBar,
  ) {
    this.data = new App();
  }

  upload(projects: Project[]): void {
    // console.log('Upload projects')
    this.data.addProjects(projects).then(resp => {
      this.snackBar.open('Projects uploaded successfully.', null, {
        duration: 2000,
      });
      this.change.emit();
    }).catch(err => {
      this.snackBar.open(err, 'Ok');
    });
  }

}
