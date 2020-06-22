import { Data } from './data';
import { SimCollection } from './simCollection';
import { SimConnectome } from './simConnectome';
import { SimModel } from './simModel';


export class SimData {
  kernel: any;
  models: any;
  collections: SimCollection[];
  connectomes: SimConnectome[];
  time: number;
  random_seed?: number;
  abc: string = 'abcdefghijklmnopqrstuvwxyz123456789';

  constructor(
    data: any = {},
  ) {
    this.kernel = data.kernel || {};
    this.models = data.models || {};
    this.collections = data.collections ? data.collections.map(d => new SimCollection(d)) : [];
    this.connectomes = data.connectomes ? data.connectomes.map(d => new SimConnectome(d)) : [];
    this.time = parseFloat(data.time) || 1000.;
    this.random_seed = parseInt(data.random_seed) || 0;
  }

  addModel(elementType: string): void {
    var model = elementType + '-' + this.abc[this.collections.length];
    this.models[model] = new SimModel({
      new: model,
    }, elementType);
  }

  addCollection(elementType: string): void {
    var model = elementType + '-' + this.abc[this.collections.length];
    this.collections.push(new SimCollection({
      model: model,
      element_type: elementType,
    }))
  }

  addConnectome(source: number, target: number): void {
    this.connectomes.push(new SimConnectome({
      source: source,
      target: target,
    }))
  }

  clean(data: Data): void {
    this.connectomes.map(connectome => connectome.clean(data))
    this.collections.map(collection => collection.clean())
  }

}
