import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatMenuTrigger } from '@angular/material/menu';

import { MdePopoverTrigger } from '@material-extended/mde';

import { AppService } from '../../app.service';

import { Project } from '../../components/project';

import { listAnimation } from '../../animations/list-animation';


@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [ listAnimation ],
})
export class ProjectListComponent implements OnInit {
  @Input() quickview: boolean = false;
  @Input() projects: Project[];
  @Output() select: EventEmitter<any> = new EventEmitter();
  public focused: Project;

  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private _appService: AppService,
  ) {
  }

  ngOnInit() {
    // console.log('Simulation list')
  }

  selected(project: Project): boolean {
    return this._appService.data.project.id === project.id;
  }

  view(project: Project, ref: MdePopoverTrigger): void {
    if (!this.quickview) return
    this._appService.rightClick = true
    // this.focused = project;
    ref.openPopover();
  }

  deleteSimulation(): void {
    this.select.emit({ mode: 'delete', selected: [this.focused.id] })
  }

  downloadSimulation(): void {
    this.select.emit({ mode: 'download', selected: [this.focused.id] })
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

  onClick(project: Project): void {
    if (!project.hasOwnProperty('_id')) return
    this.select.emit({mode: 'navigate', id: project.id})
  }

}
