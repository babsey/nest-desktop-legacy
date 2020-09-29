import { Component, OnInit, Input } from '@angular/core';

import { App } from '../../../components/app';
import { Model } from '../../../components/model/model';
import { Project } from '../../../components/project/project';
import { Activity } from '../../../components/activity/activity';
import { ActivityChartGraph } from '../../../components/activity/activityChartGraph';
import { AnalogSignalPlotPanel } from '../../../components/activity/plotPanels/analogSignalPlotPanel';

import { AppService } from '../../../services/app/app.service';


@Component({
  selector: 'app-model-activity-graph',
  templateUrl: './model-activity-graph.component.html',
  styleUrls: ['./model-activity-graph.component.scss'],
})
export class ModelActivityGraphComponent implements OnInit {
  @Input() modelId: string;
  private _project: Project;
  private _config: any = {
    staticPlot: true,
  };
  private _layout: any = {
    title: 'Neuronal response to spike inputs',
    xaxis: {
      title: 'Time [ms]'
    },
    yaxis: {
      title: 'Membrane potential [mV]'
    },
    showlegend: false,
  };
  private _style: any = {
    width: '100%',
  };
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

  get config(): any {
    return this._config;
  }

  get data(): any[] {
    return this._project.activityGraph.data;
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
