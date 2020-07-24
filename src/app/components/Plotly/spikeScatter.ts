import { Activity } from '../activity';
import { ActivityGraph } from './activityGraph';
import { Panel } from './panel';


export class SpikeScatter extends Panel {

  constructor(graph: ActivityGraph) {
    super(graph);
    this.layout.yaxis.title = 'Neuron ID';
    this.layout.yaxis.height = 4;
    this.init();
  }

  get activities(): Activity[] {
    return this.graph.project.activities.filter(activity => activity.recorder.model.existing === 'spike_detector');
  }

  init(): void {
    this.data = this.activities.map(activity => {
      return {
        activityIdx: activity.idx,
        mode: 'markers',
        type: 'scattergl',
        hoverinfo: 'x',
        legendgroup: 'spikes' + activity.idx,
        name: 'spikes of ' + activity.recorder.view.label,
        showlegend: true,
        marker: {
          size: 5,
          color: 'black',
        },
        x: [],
        y: [],
      }
    })
  }

  update(): void {
    this.init();
    this.activities.forEach(activity => {
      const data: any = this.data.find(d => d.activityIdx === activity.idx);
      data.x = activity.recorder.events.times;
      data.y = activity.recorder.events.senders;
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
