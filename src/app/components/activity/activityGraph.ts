import { Config } from '../config';
import { Project } from '../project/project';


// Parent for Plotly/ActivityChartGraph and Threejs/ActivityAnimationGraph
export class ActivityGraph {
  private _project: Project;
  private _hash: string;

  constructor(project: Project) {
    this._project = project;
    this._hash = project.hash;
  }

  get endtime(): number {
    return this._project.simulation.kernel.time;
  }

  get project(): Project {
    return this._project;
  }

  get hash(): string {
    return this._hash;
  }

  set hash(value: string) {
    this._hash = value;
  }

}
