import { Code } from '../code';
import { Project } from './project';


export class ProjectCode extends Code {
  private _project: Project;                           // parent
  private _script: string;

  constructor(project: Project) {
    super();
    this._project = project;
    this.generate();
  }

  get script(): string {
    return this._script;
  }

  set script(value: string) {
    this._script = value;
  }

  generate(sections: string[] = ['kernel', 'models', 'nodes', 'connections', 'events']): void {
    this._script = '';
    this._script += this.importModules();
    this._script += 'nest.ResetKernel()\n';

    if (sections.includes('kernel')) {
      this._script += '\n\n# Simulation kernel\n';
      this._script += this._project.simulation.code.setRandomSeed();
      this._script += this._project.simulation.code.setKernelStatus();
    }

    // if (sections.includes('models')) {
    //   this._script += '\n\n# Copy models\n';
    //   this.project.models.forEach((model: Model) => this._script += model.code.copyModel());
    // }

    if (sections.includes('nodes')) {
      this._script += '\n\n# Create nodes\n';
      this._script += this._project.network.code.createNodes();
    }

    if (sections.includes('connections')) {
      this._script += '\n\n# Connect nodes\n';
      this._script += this._project.network.code.connectNodes();
    }

    this._script += '\n\n# Run simulation\n';
    this._script += this._project.simulation.code.simulate();

    if (sections.includes('events')) {
      this._script += '\n\n# Collect activities\n';
      this._script += this._project.network.code.getActivities();
    }
  }

  importModules(): string {
    let script = '';
    script += 'import nest\n';
    script += 'import numpy as np\n';
    return script + '\n';
  }

}
