import { ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

import { App } from '../../../components/app';

import { ActivityGraphService } from '../../../services/activity/activity-graph.service';
import { AppService } from '../../../services/app/app.service';
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
    private _simulationRunService: SimulationRunService,
  ) {
    this._mobileQuery = _media.matchMedia('(max-width: 1023px)');
    this._mobileQueryListener = () => _changeDetectorRef.detectChanges();
    this._mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    if (['stats'].includes(this.view.sidenavMode)) {
      this.view.sidenavMode = 'networkController';
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

  get view(): any {
    return this.app.view.project;
  }

  isSidenavOpened(): boolean {
    return this.view.sidenavOpened;
  }

  selectMode(mode: string): void {
    this.app.view.selectProjectSidenav(mode);
    setTimeout(() => this.triggerResize(), 700);
  }

  isActive(mode: string): boolean {
    return this.view.sidenavMode === mode && this.view.sidenavOpened;
  }

  toggleSidenav(): void {
    this.view.sidenavOpened = !this.view.sidenavOpened;
  }

  triggerResize(): void {
    window.dispatchEvent(new Event('resize'));
  }


}
