import { Config } from '../config';

export class ColorSchemes {
  config: Config;

  constructor( ) {
    this.config = new Config(this.constructor.name);
  }

  list(): string[] {
    return Object.keys(this.config.data);
  }

}
