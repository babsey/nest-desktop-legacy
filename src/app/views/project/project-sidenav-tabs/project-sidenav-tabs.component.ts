import { ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

import { App } from '../../../components/app';

import { ActivityGraphService } from '../../../services/activity/activity-graph.service';
import { AppService } from '../../../services/app/app.service';
import { ProjectService } from '../../../services/project/project.service';
import { SimulationRunService } from '../../../services/simulation/simulation-run.service';


@Component({
  selector: 'app-project-sidenav-tabs',
  templateUrl: './project-sidenav-tabs.component.html',
  styleUrls: ['./project-sidenav-tabs.component.scss']
})
export class ProjectSidenavTabsComponent implements OnInit {
  private _mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private _activityGraphService: ActivityGraphService,
    private _appService: AppService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _media: MediaMatcher,
    private _projectService: ProjectService,
    private _simulationRunService: SimulationRunService,
  ) {
    this._mobileQuery = _media.matchMedia('(max-width: 1023px)');
    this._mobileQueryListener = () => _changeDetectorRef.detectChanges();
    this._mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    if (['stats'].includes(this._projectService.sidenavMode)) {
      this._projectService.sidenavMode = 'networkController';
    }
  }

  get app(): App {
    return this._appService.app;
  }

  get graphMode(): string {
    return this._activityGraphService.mode;
  }

  get mobileQuery(): MediaQueryList {
    return this._mobileQuery;
  }

  isSidenavOpened(): boolean {
    return this._projectService.sidenavOpened;
  }

  selectMode(mode: string): void {
    if (this._projectService.sidenavMode === mode) {
      this._projectService.sidenavOpened = !this._projectService.sidenavOpened;
    } else {
      this._projectService.sidenavMode = mode;
      this._projectService.sidenavOpened = true;
    }
    this._simulationRunService.viewCodeEditor = mode === 'codeEditor';
    if (mode === 'codeEditor' && this._projectService.sidenavOpened === true) {
      this.app.project.code.generate();
    }
    setTimeout(() => this.triggerResize(), 700);
  }

  isMode(mode: string): boolean {
    return this._projectService.sidenavMode === mode;
  }

  toggleSidenav(): void {
    this._projectService.sidenavOpened = !this._projectService.sidenavOpened;
  }

  toggleNetworkQuickView(): void {
    this._projectService.networkQuickView = !this._projectService.networkQuickView;
  }

  isNetworkQuickViewOpened(): boolean {
    return this._projectService.networkQuickView;
  }

  triggerResize(): void {
    window.dispatchEvent(new Event('resize'));
  }


}
