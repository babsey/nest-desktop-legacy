import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { enterAnimation } from '../../animations/enter-animation';

import { App } from '../../components/app';
import { Project } from '../../components/project/project';

import { AppService } from '../../services/app/app.service';

import { ProjectDialogComponent } from './project-dialog/project-dialog.component';


@Component({
  selector: 'app-project-navigation',
  templateUrl: './project-navigation.component.html',
  styleUrls: ['./project-navigation.component.scss'],
  animations: [enterAnimation],
})
export class ProjectNavigationComponent implements OnInit {
  private _selectionList = false;

  constructor(
    private _appService: AppService,
    private _dialog: MatDialog,
    private _router: Router,
  ) {
  }

  ngOnInit() {
  }

  get app(): App {
    return this._appService.app;
  }

  get project(): Project {
    return this.app.project;
  }

  get selectionList(): boolean {
    return this._selectionList;
  }

  set selectionList(value: boolean) {
    this._selectionList = value;
  }

  downloadAllProjects(): void {
    this.app.downloadProjects(this.app.projects.map((project: Project) => project.id));
  }

  navigate(id: string): void {
    const url = 'project/' + this.project.id;
    this._router.navigate([{ outlets: { primary: url, nav: 'project' } }]);
  }

  newProject(): void {
    this._selectionList = false;
    this.app.newProject();
    this.navigate(this.app.project.id);
  }

  saveProject(): void {
    this.project.save().then(() => {
      this.navigate(this.project.id);
    });
  }

  openProjectDialog(): void {
    const dialogRef = this._dialog.open(ProjectDialogComponent);
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }
}
