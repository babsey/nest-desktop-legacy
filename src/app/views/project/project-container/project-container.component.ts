import { ChangeDetectorRef, Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MediaMatcher } from '@angular/cdk/layout';

import { enterAnimation } from '../../../animations/enter-animation';

import { Project } from '../../../components/project/project';

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
export class ProjectContainerComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() rev: string;
  private _mobileQueryListener: () => void;
  private _mobileQuery: MediaQueryList;

  constructor(
    private _activityGraphService: ActivityGraphService,
    private _appService: AppService,
    private _bottomSheet: MatBottomSheet,
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

  ngOnDestroy() {
    this._bottomSheet.dismiss();
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

  update(): void {
    // console.log('Project container update');
    if (this.id) {
      this._appService.app.initProject(this.id, this.rev).then(() => {
        if (!this.project.hasSpatialActivities()) {
          this._activityGraphService.mode = 'chart';
        }
        this._activityGraphService.init(this.project);

        if (
          this._router.url.includes('run') || this.project.config['runAfterLoad'] &&
          !this.project.hasActivities()
        ) {
          this._projectService.mode = 'activityExplorer';
          this._simulationRunService.run(this.project, true)
        }
      }).catch(() => {
        this._router.navigate([{ outlets: { primary: 'project/' } }]);
      })
    } else {
      this._appService.app.initProject().then(() => {
        this._activityGraphService.init(this.project);
      });
    }
  }

  triggerResize(): void {
    window.dispatchEvent(new Event('resize'));
  }

  toggleNetworkQuickView(): void {
    this._projectService.networkQuickView = !this._projectService.networkQuickView;
  }

  isNetworkQuickViewOpened(): boolean {
    return this._projectService.networkQuickView;
  }

  onOpenedStart(event: any): void {
    if (this._projectService.mode === 'labBook') {
      this._projectService.mode = 'networkEditor';
    }
  }

  onClosedStart(event: any): void {
    if (this._projectService.mode === 'networkEditor') {
      this._projectService.mode = 'labBook';
    }
  }

  onOpenedChange(event: any): void {
    setTimeout(() => this.triggerResize(), 10)
  }

}
