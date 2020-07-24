import { Activity } from '../activity';
import { ActivityGraph } from './activityGraph';
import { AnalogLines } from './analogLines';


export class NeuronAnalogLines extends AnalogLines {

  constructor(graph: ActivityGraph) {
    super(graph);
    this.layout.yaxis.height = 4;
    this.init();
  }

  get activities(): Activity[] {
    return this.graph.project.activities.filter(activity =>
      ['voltmeter', 'multimeter'].includes(activity.recorder.model.existing) && activity.elementTypes.includes('neuron'));
  }

}
