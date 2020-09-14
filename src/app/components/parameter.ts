import { Node } from './node/node';
import { Model } from './model/model';
import { Connection } from './connection/connection';


export class Parameter {
  parent: Model | Node | Connection;    // parent
  idx: number;                          // generative

  id: string;
  private _value: any;

  // For node and connection
  visible: boolean;
  factors: string[];                    // not functional yet

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
    this.parent = parent;
    this.idx = param.idx || parent.params.length;

    this.id = param.id;
    this.value = param.value || 0;

    this.visible = param.visible !== undefined ? param.visible : false;
    this.factors = param.factors || [];

    this.label = param.label || '';
    this.unit = param.unit || '';
    this.level = param.level;
    this.input = param.input;
    this.max = param.max;
    this.min = param.min;
    this.step = param.step;
    this.ticks = param.ticks;
  }

  copy(): any {
    return new Parameter(this.parent, this);
  }

  get value(): any {
    return this._value;
  }

  set value(value: any) {
    this._value = value;
  }

  get options(): any {
    const model: Model = this.parent.model;
    const param: Parameter = model ? model.params.find((p: Parameter) => p.id === this.id) : null;
    return param;
  }

  toJSON(): any {
    const params: any = {
      id: this.id,
      value: this.value,
    };
    if (this.parent.name === 'Model') {
      params['input'] = this.input;
      params['label'] = this.label;
      params['unit'] = this.unit;
      if (this.input === 'valueSlider') {
        params['min'] = this.min;
        params['max'] = this.max;
        params['step'] = this.step;
      } else if (this.input === 'tickSlider') {
        params['ticks'] = this.ticks;
      }
    } else {
      params['visible'] = this.visible;
      params['factors'] = this.factors;
    }
    return params;
  }

}
