import { Code } from './code';
import { Kernel } from './kernel';


export class KernelCode extends Code {
  kernel: Kernel;

  constructor(kernel: Kernel) {
    super();
    this.kernel = kernel;
  }

  setStatus(): string {
    let script: string = '';
    script += 'nest.SetKernelStatus({';
    script += this._() + '"local_num_threads": ' + this.kernel.localNumThreads + ',';
    script += this._() + '"resolution": ' + this.kernel.resolution.toFixed(1) + ',';
    script += this._() + '"rng_seeds": ' + 'np.random.randint(0, 1000, ' + this.kernel.localNumThreads + ').tolist()';
    script += this.end() + '})\n';
    return script;
  }

}
