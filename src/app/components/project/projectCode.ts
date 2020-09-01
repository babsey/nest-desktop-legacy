import { Code } from '../code';
import { Project } from './project';


export class ProjectCode extends Code {
  project: Project;                           // parent
  script: string;

  constructor(project: Project) {
    super();
    this.project = project;
    this.generate();
  }

  generate(sections: string[] = ['kernel', 'models', 'nodes', 'connections', 'events']): void {
    this.script = '';
    this.script += this.importModules();
    this.script += 'nest.ResetKernel()\n';

    if (sections.includes('kernel')) {
      this.script += '\n\n# Simulation kernel\n';
      this.script += this.project.simulation.code.randomSeed();
      this.script += this.project.simulation.code.setKernelStatus();
    }

    // if (sections.includes('models')) {
    //   this.script += '\n\n# Copy models\n';
    //   this.project.models.forEach(model => this.script += model.code.copyModel())
    // }

    if (sections.includes('nodes')) {
      this.script += '\n\n# Create nodes\n';
      this.script += this.project.network.code.createNodes();
    }

    if (sections.includes('connections')) {
      this.script += '\n\n# Connect nodes\n';
      this.script += this.project.network.code.connectNodes();
    }

    this.script += '\n\n# Run simulation\n';
    this.script += this.project.simulation.code.simulate();

    if (sections.includes('events')) {
      this.script += '\n\n# Collect activities\n';
      this.script += this.project.network.code.getActivities();
    }
  }

  importModules(): string {
    let script: string = '';
    script += 'import nest\n';
    script += 'import numpy as np\n';
    return script + '\n';
  }

}
