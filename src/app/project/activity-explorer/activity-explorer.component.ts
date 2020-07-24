import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { SimulationRunService } from '../../simulation/services/simulation-run.service';
import { ProjectService } from '../services/project.service';
import { VisualizationService } from '../../visualization/visualization.service';

import { Project } from '../../components/project';

import { enterAnimation } from '../../animations/enter-animation';


@Component({
  selector: 'app-activity-explorer',
  templateUrl: './activity-explorer.component.html',
  styleUrls: ['./activity-explorer.component.scss'],
  animations: [enterAnimation],
})
export class ActivityExplorerComponent implements OnInit, OnDestroy {
  @Input() project: Project;
  private subscription: any;
  public layout: any = {};
  public kernel: any = {};

  constructor(
    private _projectService: ProjectService,
    private _visualizationService: VisualizationService,
    public _simulationRunService: SimulationRunService,
  ) {
  }

  ngOnInit() {
    // console.log('Init simulation playgound')
    this.subscription = this._simulationRunService.simulated.subscribe(data => this.update(data))
  }

  ngOnDestroy() {
    // console.log('Destroy simulation playgound')
    this.subscription.unsubscribe()
  }

  update(response: any): void {
    // console.log(response)
    // Update kernel time

    this._visualizationService.time = response.kernel['time'];
    this.layout.title = this.project.name;
    this._visualizationService.checkPositions(this.project.activities);
    if (['animation', 'chart'].includes(this._projectService.sidenavMode)) {
      this._projectService.sidenavMode = this._visualizationService.mode;
    }
    this._visualizationService.update.emit()
  }

}
