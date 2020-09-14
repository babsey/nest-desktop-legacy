import { Code } from '../code';
import { Simulation } from './simulation';


export class SimulationCode extends Code {
  simulation: Simulation;               // parent

  constructor(simulation: Simulation) {
    super();
    this.simulation = simulation;
  }

  setRandomSeed(): string {
    const script = `np.random.seed(${this.simulation.randomSeed})`;
    return script + '\n';
  }

  setKernelStatus(): string {
    let script = '';
    script += 'nest.SetKernelStatus({';
    script += this._() + `"local_num_threads": ${this.simulation.kernel.localNumThreads},`;
    script += this._() + `"resolution": ${this.simulation.kernel.resolution.toFixed(1)},`;
    script += this._() + `"rng_seeds": np.random.randint(0, 1000, ${this.simulation.kernel.localNumThreads}).tolist()`;
    script += this.end() + '})';
    return script + '\n';
  }

  simulate(): string {
    const script = `nest.Simulate(${this.simulation.time.toFixed(1)})`;
    return script + '\n';
  }

}
