import { Activity } from '../activity';
import { ActivityChartGraph } from '../activityChartGraph';
import { AnalogSignalPlotPanel } from './analogSignalPlotPanel';


export class NeuronAnalogSignalPlotPanel extends AnalogSignalPlotPanel {

  constructor(graph: ActivityChartGraph) {
    super(graph);
    this.id = 'NeuronAnalogSignalPlotPanel';
    this.label = 'plot of neuron analog signals';
    this.layout.yaxis.height = 2;
    this.layout.yaxis.title = 'Membrane potential [mV]';
    this.activities = this.graph.project.activities.filter((activity: Activity) => activity.hasNeuronAnalogData());
  }

}
