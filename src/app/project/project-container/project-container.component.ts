import { ChangeDetectorRef, Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MediaMatcher } from '@angular/cdk/layout';

import { AppService } from '../../app.service';
import { AnimationControllerService } from '../../visualization/animation/animation-controller/animation-controller.service';
import { ModelService } from '../../model/model.service';
import { ProjectService } from '../services/project.service';
import { SimulationRunService } from '../../simulation/services/simulation-run.service';
import { VisualizationService } from '../../visualization/visualization.service';

import { Project } from '../../components/project';

import { enterAnimation } from '../../animations/enter-animation';


@Component({
  selector: 'app-project-container',
  templateUrl: './project-container.component.html',
  styleUrls: ['./project-container.component.scss'],
  animations: [enterAnimation],
})
export class ProjectContainerComponent implements OnInit, OnDestroy {
  @Input() id: string;
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private _animationControllerService: AnimationControllerService,
    private _modelService: ModelService,
    private _simulationRunService: SimulationRunService,
    private _visualizationService: VisualizationService,
    private bottomSheet: MatBottomSheet,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private route: ActivatedRoute,
    private router: Router,
    public _appService: AppService,
    public _projectService: ProjectService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1023px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {}

  ngOnChanges() {
    console.log('Project container on changes');
    this.update();
  }

  ngOnDestroy() {
    this.bottomSheet.dismiss();
  }

  update(): void {
    console.log('Project container update')
    if (this.id) {
      this._appService.data.initProject(this.id).then(() => {
        if (this.router.url.includes('run') || this._simulationRunService.config['runAfterLoad']) {
          this.run(true)
        }
      })
    } else {
      this._projectService.mode = 'networkEditor';
      this._appService.data.initProject();
    }
  }

  run(force: boolean = false): void {
    this._projectService.mode = 'activityExplorer';
    this._animationControllerService.stop();
    this._simulationRunService.run(force)
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
    if (this._projectService.mode == 'labBook') {
      this._projectService.mode = 'networkEditor';
    }
  }

  onClosedStart(event: any): void {
    if (this._projectService.mode == 'networkEditor') {
      this._projectService.mode = 'labBook';
    }
  }

  onOpenedChange(event: any): void {
    setTimeout(() => this.triggerResize(), 10)
  }

}
