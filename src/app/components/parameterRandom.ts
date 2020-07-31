import { Config } from './config';


export class ParameterRandom {
  config: Config;

  distribution: string;
  specs: any;
  defaults: any = {
    exponential: { beta: 1 },
    uniform: { min: 0, max: 1 },
    normal: { mean: 0, std: 1 },
    lognormal: { mean: 0, std: 1 },
  }

  constructor(random: any) {
    this.config = new Config(this.constructor.name);
    this.distribution = random.distribution || 'uniform';
    this.specs = random.specs || this.defaults[random.distribution];
  }

  serialize(to: string): any {
    const specs: any = {};
    Object.keys(this.defaults[this.distribution]).map(param => {
      if (this.specs.hasOwnProperty(param)) {
        specs[param] = parseFloat(this.specs[param]);
      }
    })
    return {
      distribution: this.distribution,
      specs: specs
    };
  }

}
