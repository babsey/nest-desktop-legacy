import { Code } from './code';
import { Simulation } from './simulation';


export class SimulationCode extends Code {
  simulation: Simulation;               // parent

  constructor(simulation: Simulation) {
    super();
    this.simulation = simulation;
  }

  randomSeed(): string {
    let script: string = '';
    script += 'np.random.seed(' + this.simulation.randomSeed + ')\n';
    return script;
  }

  simulate(): string {
    let script: string = 'nest.Simulate(' + this.simulation.time.toFixed(1) + ')';
    return script + '\n';
  }

}
