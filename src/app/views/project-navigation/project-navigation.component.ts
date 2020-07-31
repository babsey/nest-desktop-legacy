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

  constructor(
    private router: Router,
    private _appService: AppService,
  ) {
    this.initFileReader()
  }

  ngOnInit() {
  }

  get app(): App {
    return this._appService.data;
  }

  downloadAllProjects(): void {
    this.app.downloadProjects(this.app.projects.map(project => project.id));
  }

  newProject(): void {
    this.selectionList = false;
    this.router.navigate([{ outlets: { primary: 'project/' } }]);
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
