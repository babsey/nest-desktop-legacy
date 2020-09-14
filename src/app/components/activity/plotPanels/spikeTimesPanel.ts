import { SpikeActivity } from '../spikeActivity';
import { ActivityChartGraph } from '../activityChartGraph';
import { ActivityGraphPanel } from './activityGraphPanel';


export class SpikeTimesPanel extends ActivityGraphPanel {

  constructor(graph: ActivityChartGraph, configName: string = null) {
    super(graph, configName);
    this.id = 'SpikeTimesPanel';
    this.label = 'parent panel of spike times';
    this.activities = this.graph.project.activities.filter((activity: SpikeActivity) => activity.hasSpikeData());
  }

  updateColor(): void {
    this.activities.forEach((activity: SpikeActivity) => {
      const data: any = this.data.find((d: any) => d.activityIdx === activity.idx);
      data.marker.color = activity.recorder.view.color;
    });
  }

}
