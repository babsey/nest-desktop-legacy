import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { AppService } from '../../app.service';
import { NetworkService } from '../../network/services/network.service';
import { SimulationEventService } from '../../simulation/services/simulation-event.service';
import { SimulationProtocolService } from '../../simulation/services/simulation-protocol.service';
import { SimulationRunService } from '../../simulation/services/simulation-run.service';
import { ProjectService } from '../services/project.service';

import { Project } from '../../components/project';

import { enterAnimation } from '../../animations/enter-animation';


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
    private _networkService: NetworkService,
    private _simulationEventService: SimulationEventService,
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
