import { Component, OnInit, ViewChild } from '@angular/core';

import { App } from '../../../components/app';
import { Project } from '../../../components/project/project';
import { DatabaseService } from '../../../components/database';

import { AppService } from '../../../services/app/app.service';


@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss']
})
export class ProjectDialogComponent implements OnInit {
  @ViewChild('file', { static: false }) file;
  private _fileReader = new FileReader();
  private _message: string;
  private _projects: Project[];
  private _selectedProjects: number[];

  constructor(
    private _appService: AppService,
  ) {
    this.initFileReader();
  }

  ngOnInit(): void {
    this.reset();
  }

  get app(): App {
    return this._appService.app;
  }

  get projects(): Project[] {
    return this._projects;
  }

  get message(): string {
    return this._message;
  }

  get selectedProjects(): number[] {
    return this._selectedProjects;
  }

  set selectedProjects(value: number[]) {
    this._selectedProjects = value;
  }

  reset(): void {
    console.log('Reset project list and index list');
    this._message = 'Select an option to upload projects.';
    this._projects = [];
    this.selectedProjects = [];
  }

  initFileReader(): void {
    this._fileReader.addEventListener('load', (event: any) => {
      this.reset();
      setTimeout(() => {
        const result: any = JSON.parse(event.target.result as string);
        const data: any[] = Array.isArray(result) ? result : [result];
        data.forEach((d: any) => {
          this._projects.push(d);
          try {
            const project: Project = new Project(this.app, d);
            d.valid = true;
          } catch (e) {
            d.valid = false;
            console.log(e);
            console.log(d);
            d.message = e;
          }
        });
        this._message = 'Select projects to add.';
      }, 1);
    });
  }

  openUploadDialog(): void {
    this.file.nativeElement.click();
  }

  onFileAdded(): void {
    this._fileReader.readAsText(this.file.nativeElement.files[0]);
  }

  addProjects(): void {
    const projects: any[] = this.projects.filter((project: any, idx: number) =>
      this.selectedProjects.includes(idx)
    );
    this.app.addProjects(projects);
  }

  isValid(project: any) {
    return project.valid;
  }

  fromDatabase(): void {
    this.reset();
    const projectDB: DatabaseService = new DatabaseService(this.app, 'protocol');
    projectDB.list().then((docs: any[]) => {
      if (docs.length === 0) {
        this._message = 'No database found.';
        return;
      }
      docs.forEach((d: any) => {
        this._projects.push(d);
        const project: Project = new Project(this.app, d);
        d.valid = project !== undefined;
      });
      this._message = 'Select projects to add.';
    });
  }

}
