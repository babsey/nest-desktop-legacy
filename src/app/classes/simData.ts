import { Data } from './data';
import { SimCollection } from './simCollection';
import { SimConnectome } from './simConnectome';
import { SimModel } from './simModel';


export class SimData {
  public kernel: any;
  public models: any;
  public collections: SimCollection[];
  public connectomes: SimConnectome[];
  public time: number;
  public random_seed?: number;

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

  addModel(model: string, elementType: string): void {
    this.models[model] = new SimModel({
      new: model,
    }, elementType);
  }

  addCollection(model: string, elementType: string): void {
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
    this.collections.map(collection => collection.clean())
    this.connectomes.map(connectome => connectome.clean(data))
  }

}
