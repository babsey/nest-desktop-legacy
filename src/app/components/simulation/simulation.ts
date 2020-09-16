import { Config } from '../config';
import { Project } from '../project/project';
import { SimulationKernel } from './simulationKernel';
import { SimulationCode } from './simulationCode';


export class Simulation extends Config {
  project: Project;                     // parent
  code: SimulationCode;

  time: number;                         // simulation time
  randomSeed: number;                   // seed for random renerator of numpy
  kernel: SimulationKernel;             // simulation kernel
  private _running = false;

  constructor(
    project: Project,
    simulation: any = {},
  ) {
    super('Simulation');
    this.project = project;
    this.kernel = new SimulationKernel(this, simulation.kernel);
    this.code = new SimulationCode(this);

    this.time = parseFloat(simulation.time) || 1000.;
    this.randomSeed = parseInt(simulation.randomSeed, 0) || 0;
  }

  get running(): boolean {
    return this._running;
  }

  set running(value: boolean) {
    this._running = value;
  }

  toJSON(target: string = 'db'): any {
    const simulation: any = {
      kernel: this.kernel.toJSON(target),
      time: this.time,
    };
    if (target === 'simulator') {
      simulation.random_seed = this.randomSeed;
    } else {
      simulation.randomSeed = this.randomSeed;
    }
    return simulation;
  }

}
