import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { enterAnimation } from '../../../animations/enter-animation';

import { Project } from '../../../components/project/project';

import { AppService } from '../../../services/app/app.service';
import { SimulationRunService } from '../../../services/simulation/simulation-run.service';
import { ProjectService } from '../../../services/project/project.service';


@Component({
  selector: 'app-project-toolbar',
  templateUrl: './project-toolbar.component.html',
  styleUrls: ['./project-toolbar.component.scss'],
  animations: [ enterAnimation ],
})
export class ProjectToolbarComponent implements OnInit {
  @Input() project: Project;
  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private _appService: AppService,
    public _simulationRunService: SimulationRunService,
    public _projectService: ProjectService,
  ) { }

  ngOnInit() {
  }

  run(force: boolean = false): void {
    this._projectService.mode = 'activityExplorer';
    this._simulationRunService.run(force)
  }

  configSimulation(): void {
    this._projectService.mode = 'activityExplorer';
    this._projectService.sidenavMode = 'simulation';
  }

  onSelectionChange(event: any): void {
    this._simulationRunService.config[event.option.value] = event.option.selected;
    this._simulationRunService.saveConfig();
  }

  onMouseOver(event: MouseEvent): void {
    this._appService.rightClick = true;
  }

  onMouseOut(event: MouseEvent): void {
    this._appService.rightClick = false;
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

}
