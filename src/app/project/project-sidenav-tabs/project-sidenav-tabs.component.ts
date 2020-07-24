import { ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

import { AppService } from '../../app.service';
import { ProjectService } from '../services/project.service';
import { SimulationRunService } from '../../simulation/services/simulation-run.service';
import { VisualizationService } from '../../visualization/visualization.service';


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
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    public _appService: AppService,
    public _visualizationService: VisualizationService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1023px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    if (['stats'].includes(this._projectService.sidenavMode)) {
      this._projectService.sidenavMode = 'networkController'
    }
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
      this._appService.data.project.code.generate();
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
