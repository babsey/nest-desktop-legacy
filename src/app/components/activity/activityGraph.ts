import { Config } from '../config';
import { Project } from '../project/project';


// Parent for Plotly/ActivityChartGraph and Threejs/ActivityAnimationGraph
export class ActivityGraph {
  project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  get endtime(): number {
    return this.project.simulation.kernel.time;
  }

}
