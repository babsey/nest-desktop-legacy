import { ChangeDetectorRef, Component, OnInit, OnChanges, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

import { enterAnimation } from '../../../animations/enter-animation';

import { Project } from '../../../components/project/project';

import { ActivityChartService } from '../../../services/activity/activity-chart.service';
import { ActivityGraphService } from '../../../services/activity/activity-graph.service';
import { AppService } from '../../../services/app/app.service';
import { ModelService } from '../../../services/model/model.service';
import { ProjectService } from '../../../services/project/project.service';
import { SimulationRunService } from '../../../services/simulation/simulation-run.service';


@Component({
  selector: 'app-project-container',
  templateUrl: './project-container.component.html',
  styleUrls: ['./project-container.component.scss'],
  animations: [enterAnimation],
})
export class ProjectContainerComponent implements OnInit, OnChanges {
  @Input() id: string;
  @Input() rev: string;
  private _mobileQueryListener: () => void;
  private _mobileQuery: MediaQueryList;

  constructor(
    private _activityChartService: ActivityChartService,
    private _activityGraphService: ActivityGraphService,
    private _appService: AppService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _media: MediaMatcher,
    private _modelService: ModelService,
    private _projectService: ProjectService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _simulationRunService: SimulationRunService,
  ) {
    this._mobileQuery = _media.matchMedia('(max-width: 1023px)');
    this._mobileQueryListener = () => _changeDetectorRef.detectChanges();
    this._mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
  }

  ngOnChanges() {
    // console.log('Project container on changes');
    if (this.id === undefined) {
      this._projectService.mode = 'networkEditor';
    }
    setTimeout(() => this.update(), 1);
  }

  get mobileQuery(): MediaQueryList {
    return this._mobileQuery;
  }

  get project(): Project {
    return this._appService.app.project;
  }

  get sidenavOpened(): boolean {
    return this._projectService.sidenavOpened;
  }

  set sidenavOpened(value: boolean) {
    this._projectService.sidenavOpened = value;
  }

  isReady(): boolean {
    return this._appService.app.projectReady;
  }

  update(): void {
    // console.log('Project container update');
    this._appService.app.projectReady = false;
    setTimeout(() => {
      if (this.id) {
        this._appService.app.initProject(this.id, this.rev).then(() => {
          if (!this.project.hasSpatialActivities) {
            this._activityGraphService.mode = 'chart';
          }
          this._activityChartService.selectedPanel = undefined;
          // this._activityGraphService.init();
          if (
            this._router.url.includes('run') || this.project.config.runAfterLoad &&
            !this.project.hasActivities && this._projectService.mode === 'activityExplorer'
          ) {
            this.project.runSimulationScript();
          }
        }).catch(() => {
          this._router.navigate([{ outlets: { primary: 'project/' } }]);
        });
      } else {
        this._appService.app.initProject();
      }
    }, 200);
  }

  triggerResize(): void {
    window.dispatchEvent(new Event('resize'));
  }

  onOpenedChange(event: any): void {
    setTimeout(() => this.triggerResize(), 10);
  }

}
