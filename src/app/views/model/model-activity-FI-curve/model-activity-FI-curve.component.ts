import { Component, OnInit, Input } from '@angular/core';

import { App } from '../../../components/app';
import { Model } from '../../../components/model/model';
import { Project } from '../../../components/project/project';
import { Activity } from '../../../components/activity/activity';
import { ActivityChartGraph } from '../../../components/activity/activityChartGraph';
import { AnalogSignalPlotPanel } from '../../../components/activity/plotPanels/analogSignalPlotPanel';

import { AppService } from '../../../services/app/app.service';


@Component({
  selector: 'app-model-activity-FI-curve',
  templateUrl: './model-activity-FI-curve.component.html',
  styleUrls: ['./model-activity-FI-curve.component.scss'],
})
export class ModelActivityFICurveComponent implements OnInit {
  @Input() modelId: string;
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
  private _registerPanels: any[] = [
    (graph: ActivityChartGraph) => new AnalogSignalPlotPanel(graph),
  ];
  private _filename = 'neuron-spike-response';


  constructor(
    private _appService: AppService,
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
    return this._graph ? this._graph.data : [];
  }

  get layout(): any {
    return this._layout;
  }

  get style(): any {
    return this._style;
  }

  update(): void {
    if (this.modelId) {
      this._project = this._appService.app.createProjectFromAssets(this._filename);
      this._project.network.nodes[1].modelId = this.modelId;
      this._project.code.generate();
      this._project.initActivityGraph(this._registerPanels);
      this._project.runSimulationCode();
    }
  }

}
