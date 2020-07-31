import { Project } from '../project/project';


// Parent object for Plotly/ActivityChartGraph and Threejs/ActivityAnimationGraph
export class ActivityGraph {
  project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  get endtime(): number {
    return this.project.simulation.kernel.time;
  }

}
