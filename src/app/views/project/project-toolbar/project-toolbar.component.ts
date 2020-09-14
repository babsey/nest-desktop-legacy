import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';

import { enterAnimation } from '../../../animations/enter-animation';

import { Project } from '../../../components/project/project';

import { SimulationRunService } from '../../../services/simulation/simulation-run.service';
import { ProjectService } from '../../../services/project/project.service';


@Component({
  selector: 'app-project-toolbar',
  templateUrl: './project-toolbar.component.html',
  styleUrls: ['./project-toolbar.component.scss'],
  animations: [enterAnimation],
})
export class ProjectToolbarComponent implements OnInit {
  @Input() project: Project;

  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private _projectService: ProjectService,
    private _router: Router,
    private _simulationRunService: SimulationRunService,
  ) { }

  ngOnInit() {
  }

  get running(): boolean {
    return this._simulationRunService.running;
  }

  duplicateProject(): void {
    const project: Project = this.project.duplicate();
    this.navigate(project.id);
  }

  navigate(id: string): void {
    const url: string = 'project/' + id;
    this._router.navigate([{ outlets: { primary: url, nav: 'project' } }]);
  }

  run(): void {
    this.selectMode('activityExplorer');
    this._simulationRunService.run(this.project, true);
  }

  configSimulation(): void {
    this.selectMode('activityExplorer');
    this._projectService.sidenavMode = 'simulation';
  }

  selectMode(mode: string): void {
    this._projectService.mode = mode;
  }

  isMode(mode: string): boolean {
    return this._projectService.mode === mode;
  }

  onSelectionChange(event: any): void {
    const configData: any = this.project.config;
    configData[event.option.value] = event.option.selected;
    this.project.config = configData;
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

}
