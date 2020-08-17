import { ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

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
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private _projectService: ProjectService,
    private _simulationRunService: SimulationRunService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _media: MediaMatcher,
    public appService: AppService,
    public activityGraphService: ActivityGraphService,
  ) {
    this.mobileQuery = _media.matchMedia('(max-width: 1023px)');
    this._mobileQueryListener = () => _changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    if (['stats'].includes(this._projectService.sidenavMode)) {
      this._projectService.sidenavMode = 'networkController'
    }
  }

  get config(): any {
    return this.appService.data.config.data;
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
    if (mode == 'codeEditor' && this._projectService.sidenavOpened == true) {
      this.appService.data.project.code.generate();
    }
    this._simulationRunService.mode = (mode === 'codeEditor' ? 'imperative' : 'declarative');
    setTimeout(() => this.triggerResize(), 500)
  }

  isMode(mode: string): boolean {
    return this._projectService.sidenavOpened && this._projectService.isSidenavMode(mode);
  }

  triggerResize(): void {
    window.dispatchEvent(new Event('resize'));
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

}
