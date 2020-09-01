import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { enterAnimation } from '../../animations/enter-animation';

import { App } from '../../components/app';
import { Project } from '../../components/project/project';

import { AppService } from '../../services/app/app.service';


@Component({
  selector: 'app-project-navigation',
  templateUrl: './project-navigation.component.html',
  styleUrls: ['./project-navigation.component.scss'],
  animations: [enterAnimation],
})
export class ProjectNavigationComponent implements OnInit {
  @ViewChild('file', { static: false }) file;
  public selectionList: boolean = false;
  public fileReader = new FileReader();
  private _projectName: string = '';

  constructor(
    private _appService: AppService,
    private _router: Router,
  ) {
    this.initFileReader()
  }

  ngOnInit() {
  }

  get app(): App {
    return this._appService.app;
  }

  get project(): Project {
    return this.app.project;
  }

  downloadAllProjects(): void {
    this.app.downloadProjects(this.app.projects.map(project => project.id));
  }

  navigate(id: string): void {
    let url: string = 'project/' + this.project.id;
    this._router.navigate([{ outlets: { primary: url, nav: 'project' } }]);
  }

  newProject(): void {
    this.selectionList = false;
    this.app.newProject();
    this.navigate(this.app.project.id);
  }

  saveProject(): void {
    this.project.save().then(() => {
      this.navigate(this.project.id);
    })
  }

  initFileReader(): void {
    this.fileReader.addEventListener("load", event => {
      const result: any = JSON.parse(event['target']['result'] as string);
      const data: any[] = result.hasOwnProperty("_id") ? [result] : result;
      const projects: Project[] = data.map(d => new Project(this.app, d));
      this._appService.upload(projects);
    });
  }

  openUploadDialog(): void {
    this.file.nativeElement.click();
  }

  onFileAdded(): void {
    this.fileReader.readAsText(this.file.nativeElement.files[0]);
  }

}
