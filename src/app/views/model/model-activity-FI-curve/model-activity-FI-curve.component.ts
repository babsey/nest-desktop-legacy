import { Component, OnInit, Input } from '@angular/core';

import { App } from '../../../components/app';
import { Model } from '../../../components/model/model';
import { Project } from '../../../components/project/project';
import { Activity } from '../../../components/activity/activity';
import { ActivityChartGraph } from '../../../components/activity/Plotly/activityChartGraph';

import { AppService } from '../../../services/app/app.service';
import { SimulationRunService } from '../../../services/simulation/simulation-run.service';


@Component({
  selector: 'app-model-activity-FI-curve',
  templateUrl: './model-activity-FI-curve.component.html',
  styleUrls: ['./model-activity-FI-curve.component.scss'],
})
export class ModelActivityFICurveComponent implements OnInit {
  @Input() model: string;
  private _project: Project;
  private _graph: ActivityChartGraph;
  private _config: any = {
    staticPlot: true,
  };
  private _data: any[] = [{
    mode: 'lines',
    type: 'scatter',
    x: [0, 1],
    y: [1, 0]
  }];
  private _layout: any = {
    title: 'Neuronal response to spike inputs',
    xaxis: {
      title: 'Time [ms]'
    },
    yaxis: {
      title: 'Membrane potential [mV]'
    },
    showlegend: false
  };
  private _style: any = {};


  constructor(
    private _appService: AppService,
    private _simulationRunService: SimulationRunService,
  ) { }

  ngOnInit() {
    this.update();
  }

  get activity(): Activity {
    return this._project.activities[0];
  }

  get config(): any {
    return this._config;
  }

  get data(): any[] {
    return this._graph.data;
  }

  get layout(): any {
    return this._layout;
  }

  get style(): any {
    return this._style;
  }

  update(): void {
    this._project = this._appService.app.createNeuronModelProject(this.model);
    this._simulationRunService.run(this._project, true).then(() => {
      this._graph = new ActivityChartGraph(this._project, 'model');
    });
  }

}
