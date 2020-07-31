import { Activity } from '../activity';
import { ActivityChartGraph } from './activityChartGraph';
import { AnalogLines } from './analogLines';


export class NeuronAnalogLines extends AnalogLines {

  constructor(graph: ActivityChartGraph) {
    super(graph);
    this.layout.yaxis.height = 4;
    this.init();
  }

  get activities(): Activity[] {
    return this.graph.project.activities.filter(activity =>
      ['voltmeter', 'multimeter'].includes(activity.recorder.model.existing) && activity.elementTypes.includes('neuron'));
  }

}
