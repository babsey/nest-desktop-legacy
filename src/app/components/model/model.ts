import { App } from '../app';
import { Config } from '../config';
import { Parameter } from '../parameter';
import { ModelCode } from './modelCode';


enum ElementType {
  neuron = 'neuron',
  recorder = 'recorder',
  stimulator = 'stimulator',
  synapse = 'synapse',
}

export class Model {
  app: App;                             // parent
  idx: number;                          // generative
  code: ModelCode;                      // code for model

  id: string;                           // model id
  existing: string;                     // existing model in NEST
  elementType: ElementType;             // element type of the model
  label: string;                        // model label for view
  params: Parameter[] = [];             // model parameters
  recordables: string[];                // recordables for multimeter

  constructor(app: App, model: any) {
    this.app = app;
    this.idx = this.app.models.length;
    this.code = new ModelCode(this);

    this.id = model.id;
    this.elementType = model.elementType || model.element_type;
    this.existing = model.existing || model.id;
    this.label = model.label || '';
    model.params.forEach((param: any) => this.addParameter(param));
    this.recordables = model.recordables || [];
  }

  get model(): Model {
    return this;
  }

  get value(): string {
    return this.id;
  }

  addParameter(param: any): void {
    this.params.push(new Parameter(this, param));
  }

  clean(): void {
    this.idx = this.app.models.indexOf(this);
  }

  clone(): Model {
    return new Model(this.app, this);
  }

  isNeuron(): boolean {
    return this.elementType === 'neuron';
  }

  isRecorder(): boolean {
    return this.elementType === 'recorder';
  }

  isStimulator(): boolean {
    return this.elementType === 'stimulator';
  }

  toJSON(target: string = 'db'): any {
    const model: any = {
      existing: this.existing,
    };
    if (target === 'simulator') {
      model['new'] = this.id;
      model['params'] = {};
      this.params.forEach((param: Parameter) => model.params[param.id] = param.value);
    } else {
      model['id'] = this.id;
      model['elementType'] = this.elementType;
      model['label'] = this.label;
      model['params'] = this.params.map((param: Parameter) => param.toJSON());
      if (this.recordables.length > 0) {
        model['recordables'] = this.recordables;
      }
      model['version'] = this.app.version;
    }
    return model;
  }

}
