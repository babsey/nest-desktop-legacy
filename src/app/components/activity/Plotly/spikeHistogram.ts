import { Activity } from '../activity';
import { ActivityChartGraph } from './activityChartGraph';
import { Panel } from './panel';


export class SpikeHistogram extends Panel {
  public state: any = {
    binsize: 10.0,
    barmode: 'overlay',
    barnorm: '',
  };

  constructor(graph: ActivityChartGraph) {
    super('SpikeHistogram', graph);
    this.layout.yaxis.title = 'Spike count';
    this.init();
  }

  get activities(): Activity[] {
    return this.graph.project.activities.filter(activity => activity.recorder.model.existing === 'spike_detector');
  }

  init(): void {
    this.data = this.activities.map(activity => {
      return {
        activityIdx: activity.idx,
        type: 'histogram',
        source: 'x',
        histfunc: 'count',
        text: 'auto',
        legendgroup: 'spikes' + activity.idx,
        name: 'spikes of ' + activity.recorder.view.label,
        hoverinfo: 'y',
        visible: true,
        showlegend: false,
        opacity: .6,
        marker: {
          color: 'black',
          line: {
            color: 'white',
            width: 1,
          }
        },
        x: [],
      }
    })
  }

  update(): void {
    this.init();
    this.activities.forEach(activity => {
      const data: any = this.data.find(d => d.activityIdx === activity.idx);
      const start: number = 0;
      const end: number = activity.endtime;
      const size: number = this.state.binsize;
      data.x = activity.events.times;
      data.marker.line.width = (end - start) / size > 100 ? 0 : 1;
      data.marker.color = activity.recorder.view.color;
    })
  }

  updateColor(): void {
    this.activities.forEach(activity => {
      const data: any = this.data.find(d => d.activityIdx === activity.idx);
      data.marker.color = activity.recorder.view.color;
    })
  }

}
