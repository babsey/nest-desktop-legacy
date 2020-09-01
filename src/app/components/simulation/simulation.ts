import { Config } from '../config';
import { Project } from '../project/project';
import { SimulationKernel } from './simulationKernel';
import { SimulationCode } from './simulationCode';


export class Simulation {
  project: Project;                     // parent
  config: Config;
  code: SimulationCode;

  time: number;                         // simulation time
  randomSeed: number;                   // seed for random renerator of numpy
  kernel: SimulationKernel;             // simulation kernel

  constructor(
    project: Project,
    simulation: any = {},
  ) {
    this.project = project,
    this.config = new Config(this.constructor.name);
    this.kernel = new SimulationKernel(this, simulation.kernel);
    this.code = new SimulationCode(this);

    this.time = parseFloat(simulation.time) || 1000.;
    this.randomSeed = parseInt(simulation.randomSeed) || 0;
  }

  serialize(to: string): any {
    const simulation: any = {
      kernel: this.kernel.serialize(to),
      time: this.time,
    }
    if (to === 'simulator') {
      simulation['random_seed'] = this.randomSeed;
    } else {
      simulation['randomSeed'] = this.randomSeed;
    }
    return simulation;
  }



}
