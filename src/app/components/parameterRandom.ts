import { Config } from './config';


export class ParameterRandom extends Config {
  private _defaults: any;
  private _distribution: string;
  private _specs: any;

  constructor(random: any) {
    super('ParameterRandom');
    this._defaults = {
      exponential: { beta: 1 },
      uniform: { min: 0, max: 1 },
      normal: { mean: 0, std: 1 },
      lognormal: { mean: 0, std: 1 },
    };
    this._distribution = random.distribution || 'uniform';
    this._specs = random.specs || this._defaults[random.distribution];
  }

  get defaults(): any {
    return this._defaults;
  }

  get distribution(): string {
    return this._distribution;
  }

  get specs(): any {
    return this._specs;
  }

  toJSON(): any {
    const specs: any = {};
    Object.keys(this._defaults[this._distribution]).map((param: string) => {
      if (this._specs.hasOwnProperty(param)) {
        specs[param] = parseFloat(this._specs[param]);
      }
    });
    return {
      distribution: this._distribution,
      specs,
    };
  }

}
