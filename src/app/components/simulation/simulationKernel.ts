import { Config } from '../config';
import { Simulation } from './simulation';


export class SimulationKernel extends Config {
  simulation: Simulation;               // parent

  time: number;                         // endtime of the simulation
  resolution: number;                   // time resolution of simulation steps
  localNumThreads: number;              // number of threads

  constructor(
    simulation: Simulation,
    kernel: any = {},
  ) {
    super('SimulationKernel');
    this.simulation = simulation;

    this.time = 0;
    this.resolution = kernel.resolution || 1;
    this.localNumThreads = kernel.localNumThreads || 1;
  }

  toJSON(target: string = 'db'): any {
    const kernel: any = {
      resolution: this.resolution,
    };
    if (target === 'simulator') {
      kernel.local_num_threads = kernel.localNumThreads;
    } else {
      kernel.localNumThreads = kernel.localNumThreads;
    }
    return kernel;
  }

}
