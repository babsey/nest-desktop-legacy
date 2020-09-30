import { Node } from './node/node';
import { Model } from './model/model';
import { Connection } from './connection/connection';


export class Parameter {
  private _factors: string[];                    // not functional yet
  private _id: string;
  private _idx: number;                          // generative
  private _parent: Model | Node | Connection;    // parent
  private _value: any;
  private _visible: boolean;

  // For model
  label: string;
  unit: string;
  level: number;
  input: string;
  max: number;
  min: number;
  step: number;
  ticks: any[];

  constructor(parent: Model | Node | Connection, param: any) {
    this._parent = parent;
    this._idx = param.idx || parent.params.length;

    this._id = param.id;
    this._value = param.value || 0;

    this._visible = param.visible !== undefined ? param.visible : false;
    this._factors = param.factors || [];

    this.label = param.label || '';
    this.unit = param.unit || '';
    this.level = param.level;
    this.input = param.input;
    this.max = param.max;
    this.min = param.min;
    this.step = param.step;
    this.ticks = param.ticks;
  }

  get id(): string {
    return this._id;
  }

  get factors(): string[] {
    return this._factors;
  }

  // get idx(): number {
  //   return this._idx;
  // }

  get options(): any {
    const model: Model = this._parent.model;
    const param: Parameter = model ? model.params.find((p: Parameter) => p.id === this.id) : null;
    return param;
  }

  get parent(): Model | Node | Connection {
    return this._parent;
  }

  get value(): any {
    return this._value;
  }

  set value(value: any) {
    // console.log('Set parameter value');
    this._value = value;
    if (['Node', 'Connection'].includes(this._parent.name)) {
      this.parent.network.networkChanges();
    }
    this.parent.network.project.simulateAfterChange();
  }

  get visible(): boolean {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
  }

  copy(): any {
    return new Parameter(this.parent, this);
  }

  reset(): void {
    this._value = this.options.value;
  }

  toJSON(): any {
    const params: any = {
      id: this._id,
      value: this._value,
    };
    if (this._parent.name === 'Model') {
      params.input = this.input;
      params.label = this.label;
      params.unit = this.unit;
      if (this.input === 'valueSlider') {
        params.min = this.min;
        params.max = this.max;
        params.step = this.step;
      } else if (this.input === 'tickSlider') {
        params.ticks = this.ticks;
      }
    } else {
      params.visible = this._visible;
      params.factors = this._factors;
    }
    return params;
  }

}
