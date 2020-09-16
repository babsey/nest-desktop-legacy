import { Connection } from './connection';
import { Model } from '../model/model';
import { Parameter } from '../parameter';
import { SynapseCode } from './synapseCode';


export class Synapse {
  connection: Connection;                // parent
  code: SynapseCode;

  // arguments for synapse in nest.Connect
  private _modelId: string;
  params: Parameter[] = [];

  constructor(connection: any, synapse: any) {
    this.connection = connection;
    this.code = new SynapseCode(this);
    this._modelId = '';

    if (synapse !== undefined && synapse.params.length > 0) {
      this._modelId = synapse.model || 'static_synapse';
      this.initParameters(synapse);
    } else {
      this.modelId = 'static_synapse';
    }
  }

  get model(): Model {
    return this.connection.network.project.app.getModel(this.modelId);
  }

  set model(model: Model) {
    this.modelId = model.id;
  }

  get modelId(): string {
    return this._modelId;
  }

  set modelId(value: string) {
    this._modelId = value;
    this.initParameters();
  }

  get weight(): number {
    const weight: any = this.params.find((param: Parameter) => param.id === 'weight');
    return weight ? weight.value : 1;
  }

  set weight(value: number) {
    const weight: any = this.params.find((param: Parameter) => param.id === 'weight');
    weight.value = value;
  }

  get delay(): number {
    const delay: any = this.params.find((param: Parameter) => param.id === 'delay');
    return delay ? delay.value : 1;
  }

  initParameters(synapse: any = null): void {
    // Update parameters from model or node
    this.params = [];
    if (this.model && synapse && synapse.hasOwnProperty('params')) {
      this.model.params.forEach((modelParam: Parameter) => {
        const synParam = synapse.params.find((param: Parameter) => param.id === modelParam.id);
        this.addParameter(synParam || modelParam);
      });
    } else if (this.model) {
      this.model.params.forEach((param: Parameter) => this.addParameter(param));
    } else if (synapse.hasOwnProperty('params')) {
      synapse.params.forEach((param: Parameter) => this.addParameter(param));
    }
  }

  addParameter(param: any): void {
    this.params.push(new Parameter(this.connection, param));
  }

  inverseWeight(): void {
    this.weight = -1 * this.weight;
    this.connection.connectionChanges();
  }

  toJSON(target: string = 'db'): any {
    const synapse: any = {
      model: this.modelId,
    };

    if (target === 'simulator') {
      // Collect specifications of the synapse
      this.params
        .filter((param: Parameter) => param.visible === undefined || param.visible)
        .forEach((param: Parameter) => synapse[param.id] = param.value);
    } else {
      synapse.params = this.params.map((param: Parameter) => param.toJSON());
    }

    return synapse;
  }

}
