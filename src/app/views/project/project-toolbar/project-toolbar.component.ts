import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';

import { enterAnimation } from '../../../animations/enter-animation';

import { Project } from '../../../components/project/project';

import { ActivityAnimationService } from '../../../services/activity/activity-animation.service';
import { SimulationRunService } from '../../../services/simulation/simulation-run.service';


@Component({
  selector: 'app-project-toolbar',
  templateUrl: './project-toolbar.component.html',
  styleUrls: ['./project-toolbar.component.scss'],
  animations: [enterAnimation],
})
export class ProjectToolbarComponent implements OnInit {
  @Input() project: Project;
  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  private _contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private _activityAnimationService: ActivityAnimationService,
    private _router: Router,
    private _simulationRunService: SimulationRunService,
  ) { }

  ngOnInit() {
  }

  get contextMenuPosition(): any {
    return this._contextMenuPosition;
  }

  get view(): any {
    return this.project.app.view.project;
  }

  navigate(id: string): void {
    const url: string = 'project/' + id;
    this._router.navigate([{ outlets: { primary: url, nav: 'project' } }]);
  }

  run(): void {
    this.selectMode('activityExplorer');
    this._simulationRunService.run(this.project);
  }

  oldest(): void {
    this.project.network.oldest();
    this._activityAnimationService.update.emit();
  }

  older(): void {
    this.project.network.older();
    this._activityAnimationService.update.emit();
  }

  newer(): void {
    this.project.network.newer();
    this._activityAnimationService.update.emit();
  }

  newest(): void {
    this.project.network.newest();
    this._activityAnimationService.update.emit();
  }

  countBefore(): number {
    return this.project.networkRevisionIdx;
  }

  countAfter(): number {
    return this.project.networkRevisions.length - this.project.networkRevisionIdx - 1;
  }

  selectMode(mode: string): void {
    this.project.app.view.selectProjectMode(mode);
  }

  isActive(mode: string): boolean {
    return this.view.mode === mode;
  }

  onSelectionChange(event: any): void {
    const configData: any = this.project.config;
    configData[event.option.value] = event.option.selected;
    this.project.config = configData;
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this._contextMenuPosition.x = event.clientX + 'px';
    this._contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

}
