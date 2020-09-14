import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';

import { listAnimation } from '../../../animations/list-animation';

import { App } from '../../../components/app';
import { Project } from '../../../components/project/project';



@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [listAnimation],
})
export class ProjectListComponent implements OnInit {
  @Input() app: App;
  private _focused: Project;

  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private _router: Router,
  ) { }

  ngOnInit() {
    // console.log('Ng init project list');
  }

  get focused(): Project {
    return this._focused;
  }

  date(project: Project): string {
    return project.updatedAt || project.createdAt;
  }

  navigate(id: string): void {
    const url: string = 'project/' + id;
    this._router.navigate([{ outlets: { primary: url, nav: 'project' } }]);
  }

  reloadProject(): void {
    this.focused.reload().then(() => {
      this.navigate(this.focused.id);
    });
  }

  duplicateProject(): void {
    const project: Project = this.focused.duplicate();
    this.navigate(project.id);
  }

  loadRevisions(): void {
    this.app.updateProjectRevisions(this.focused.id);
    this.navigate(this.focused.id);
  }

  onContextMenu(event: MouseEvent, project: Project): void {
    event.preventDefault();
    this._focused = project;
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }


}
