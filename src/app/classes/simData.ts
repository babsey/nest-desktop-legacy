import { Data } from './data';
import { SimNode } from './simNode';
import { SimConnection } from './simConnection';
import { SimModel } from './simModel';


export class SimData {
  public kernel: any;
  public models: any;
  public collections: SimNode[];
  public connectomes: SimConnection[];
  public time: number;
  public random_seed?: number;

  constructor(
    data: any = {},
  ) {
    this.kernel = data.kernel || {};
    this.models = data.models || {};
    this.collections = data.collections ? data.collections.map(d => new SimNode(d)) : [];
    this.connectomes = data.connectomes ? data.connectomes.map(d => new SimConnection(d)) : [];
    this.time = parseFloat(data.time) || 1000.;
    this.random_seed = parseInt(data.random_seed) || 0;
  }

  addModel(model: string, elementType: string): void {
    this.models[model] = new SimModel({
      new: model,
    }, elementType);
  }

  addCollection(elementType: string): void {
    this.collections.push(new SimNode({
      element_type: elementType,
    }))
  }

  addConnectome(source: number, target: number): void {
    this.connectomes.push(new SimConnection({
      source: source,
      target: target,
    }))
  }

  clean(data: Data): void {
    this.collections.map(collection => collection.clean(data))
    this.connectomes.map(connectome => connectome.clean(data))
  }

  getModel(node: SimNode): string {
    return this.models.hasOwnProperty(node.model) ? this.models[node.model].existing : node.model;
  }

}
