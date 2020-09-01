import { Config } from '../config';
import { Simulation } from './simulation';


export class SimulationKernel {
  simulation: Simulation;               // parent
  config: Config;                       // config

  time: number;                         // endtime of the simulation
  resolution: number;                   // time resolution of simulation steps
  localNumThreads: number;              // number of threads

  constructor(
    simulation: Simulation,
    kernel: any = {},
  ) {
    this.simulation = simulation;
    this.config = new Config(this.constructor.name);

    this.time = 0;
    this.resolution = kernel.resolution || 1;
    this.localNumThreads = kernel.localNumThreads || 1;
  }

  serialize(to: string): any {
    const kernel: any = {
      resolution: this.resolution,
    };
    if (to === 'simulator') {
      kernel['local_num_threads'] = kernel.localNumThreads;
    } else {
      kernel['localNumThreads'] = kernel.localNumThreads;
    }
    return kernel;
  }
}
