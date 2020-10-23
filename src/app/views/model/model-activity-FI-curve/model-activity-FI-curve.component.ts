import { Component, OnInit, Input } from '@angular/core';

import { Project } from '../../../components/project/project';
import { Activity } from '../../../components/activity/activity';
import { ActivityChartGraph } from '../../../components/activity/activityChartGraph';
import { AnalogSignalPlotPanel } from '../../../components/activity/plotPanels/analogSignalPlotPanel';

import { AppService } from '../../../services/app/app.service';


@Component({
  selector: 'app-model-activity-fi-curve',
  templateUrl: './model-activity-FI-curve.component.html',
  styleUrls: ['./model-activity-FI-curve.component.scss'],
})
export class ModelActivityFICurveComponent implements OnInit {
  @Input() modelId: string;
  private _config: any;
  private _data: any[];
  private _filename = 'neuron-spike-response';
  private _graph: ActivityChartGraph;
  private _layout: any;
  private _project: Project;
  private _registerPanels: any[];
  private _style: any;


  constructor(
    private _appService: AppService,
  ) {
    this._config = {
      staticPlot: true,
    };
    this._layout = {
      title: 'Neuronal response to spike inputs',
      xaxis: {
        title: 'Time [ms]'
      },
      yaxis: {
        title: 'Membrane potential [mV]'
      },
      showlegend: false
    };
    this._registerPanels = [
      (graph: ActivityChartGraph) => new AnalogSignalPlotPanel(graph),
    ];
    this._style = {
      width: '100%',
    };
  }

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
    return this._project.activityChartGraph.data;
  }

  get layout(): any {
    return this._layout;
  }

  get style(): any {
    return this._style;
  }

  update(): void {
    if (this.modelId) {
      this._project = this._appService.app.initProjectFromAssets(this._filename);
      this._project.network.nodes[1].modelId = this.modelId;
      this._project.code.generate();
      this._project.initActivityChartGraph(this._registerPanels);
      this._project.runSimulationCode();
    }
  }

}
