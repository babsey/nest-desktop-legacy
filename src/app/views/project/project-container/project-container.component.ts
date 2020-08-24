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
  @Input() id: string = '';
  private _mobileQueryListener: () => void;
  public mobileQuery: MediaQueryList;

  constructor(
    private _activityGraphService: ActivityGraphService,
    private _modelService: ModelService,
    private _simulationRunService: SimulationRunService,
    private _bottomSheet: MatBottomSheet,
    private _changeDetectorRef: ChangeDetectorRef,
    private _media: MediaMatcher,
    private _route: ActivatedRoute,
    private _router: Router,
    public appService: AppService,
    public projectService: ProjectService,
  ) {
    this.mobileQuery = _media.matchMedia('(max-width: 1023px)');
    this._mobileQueryListener = () => _changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() { }

  ngOnChanges() {
    console.log('Project container on changes');
    if (this.id === undefined) {
      this.projectService.mode = 'networkEditor';
    }
    this.update();
  }

  ngOnDestroy() {
    this._bottomSheet.dismiss();
  }

  update(): void {
    console.log('Project container update');
    if (this.id) {
      this.appService.data.initProject(this.id).then(() => {
        this._activityGraphService.init.emit();
        if (this._router.url.includes('run') || this._simulationRunService.config['runAfterLoad']) {
          this.projectService.mode = 'activityExplorer';
          this._simulationRunService.run(this.appService.data.project, true)
        }
      }).catch(() => {
        this._router.navigate([{ outlets: { primary: 'project/' } }]);
      })
    } else {
      this.appService.data.initProject();
      this._activityGraphService.init.emit();
    }
  }

  triggerResize(): void {
    window.dispatchEvent(new Event('resize'));
  }

  toggleNetworkQuickView(): void {
    this.projectService.networkQuickView = !this.projectService.networkQuickView;
  }

  isNetworkQuickViewOpened(): boolean {
    return this.projectService.networkQuickView;
  }

  onOpenedStart(event: any): void {
    if (this.projectService.mode == 'labBook') {
      this.projectService.mode = 'networkEditor';
    }
  }

  onClosedStart(event: any): void {
    if (this.projectService.mode == 'networkEditor') {
      this.projectService.mode = 'labBook';
    }
  }

  onOpenedChange(event: any): void {
    setTimeout(() => this.triggerResize(), 10)
  }

}
