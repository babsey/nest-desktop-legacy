import { App } from '../app';
import { Config } from '../config';
import { Network } from '../network/network';
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
  code: ModelCode;                      // code for model
  private _name = 'Model';

  private _doc: any;                             // doc data of the database
  private _id: string;                           // model id
  private _idx: number;                          // generative
  private _elementType: string;                  // element type of the model
  private _existing: string;                     // existing model in NEST
  private _label: string;                        // model label for view
  private _abbreviation: string;
  private _params: Parameter[] = [];             // model parameters
  recordables: string[];                // recordables for multimeter

  constructor(app: App, model: any) {
    this.app = app;
    this.code = new ModelCode(this);

    this._doc = model;
    this._id = model.id;
    this._idx = this.app.models.length;
    this._elementType = model.elementType !== undefined ? model.elementType : model.element_type;
    this._existing = model.existing || model.id;

    this._label = model.label || '';
    this._abbreviation = model.abbreviation;
    model.params.forEach((param: any) => this.addParameter(param));
    this.recordables = model.recordables || [];
  }

  get name(): string {
    return this._name;
  }

  get id(): string {
    return this._id;
  }

  get elementType(): string {
    return this._elementType;
  }

  get existing(): string {
    return this._existing;
  }

  get abbreviation(): string {
    return this._abbreviation;
  }

  get label(): string {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
  }

  get model(): Model {
    return this;
  }

  get network(): Network {
    return ;
  }

  get params(): Parameter[] {
    return this._params;
  }

  get value(): string {
    return this.id;
  }

  getParameter(id: string): Parameter {
    return this._params.find((param: Parameter) => param.id === id);
  }

  addParameter(param: any): void {
    this._params.push(new Parameter(this, param));
  }

  newParameter(paramId: string, value: any): void {
    const param: any = {
      id: paramId,
      label: paramId,
      value: value,
      level: 1,
      input: 'valueSlider',
      min: 0,
      max: 100,
      step: 1
    };
    if (Array.isArray(value)) {
      param.input = 'arrayInput';
    }
    this.addParameter(param);
    this._params.sort((a: any, b: any) => a.id - b.id);
  }

  removeParameter(paramId: string): void {
    this._params = this.params.filter((param: Parameter) => param.id !== paramId);
  }

  updateParameter(param: any): void {
    const idx: number = this._params.map((p: Parameter) => p.id).indexOf(param.id);
    this._params[idx] = new Parameter(this, param);
  }

  clean(): void {
    this._idx = this.app.models.indexOf(this);
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

  delete(): Promise<any> {
    return this.app.deleteModel(this._doc._id);
  }

  save(): Promise<any> {
    return this.app.saveModel(this);
  }

  toJSON(target: string = 'db'): any {
    const model: any = {
      existing: this.existing,
    };
    if (target === 'simulator') {
      model.new = this.id;
      model.params = {};
      this.params.forEach((param: Parameter) => model.params[param.id] = param.value);
    } else {
      model.id = this.id;
      model.elementType = this.elementType;
      model.label = this.label;
      model.abbreviation = this.abbreviation;
      model.params = this.params.map((param: Parameter) => param.toJSON());
      if (this.recordables.length > 0) {
        model.recordables = this.recordables;
      }
      model.version = this.app.version;
    }
    return model;
  }

}
