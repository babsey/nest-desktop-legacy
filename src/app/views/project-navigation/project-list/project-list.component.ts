import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';

import { listAnimation } from '../../../animations/list-animation';

import { App } from '../../../components/app';
import { Project } from '../../../components/project/project';

import { AppService } from '../../../services/app/app.service';


@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [ listAnimation ],
})
export class ProjectListComponent implements OnInit {
  @Input() app: App;
  public focused: Project;

  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private _appService: AppService,
    private _router: Router,
  ) {
  }

  ngOnInit() {
    console.log('Ng init project list')
  }

  onClick(project: Project): void {
    const url: string = 'project/' + project.id;
    this._router.navigate([{ outlets: { primary: url, nav: 'project' } }]);
  }

  onMouseOver(event: MouseEvent): void {
    this._appService.rightClick = true;
  }

  onMouseOut(event: MouseEvent): void {
    this._appService.rightClick = false;
    // this.selected = null;
  }

  onContextMenu(event: MouseEvent, project: Project): void {
    event.preventDefault();
    this.focused = project;
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

}
