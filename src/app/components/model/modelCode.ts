import { Code } from '../code';
import { Model } from './model';
import { Parameter } from '../parameter';


export class ModelCode extends Code {
  model: Model;

  constructor(model: Model) {
    super();
    this.model = model;
  }

  copyModel(): string {
    let script = '';
    script += `nest.CopyModel("${this.model.existing}", "${this.model.id}"`;
    script += this.modelParams();
    script += ')';
    return script + '\n';
  }

  modelParams(): string {
    let script = '';
    if (this.model.params === undefined || this.model.params.length === 0) { return script; }
    const paramsList: string[] = [];
    this.model.params
      .filter((param: Parameter) => param.visible)
      .map((param: Parameter) => {
        if (param.id === 'record_from') {
          const recordFrom: string[] = param.value.map((val: string) => `"${val}"`);
          paramsList.push(this._() + `"${param.id}": [${recordFrom.join(',')}]`);
        } else {
          paramsList.push(this._() + `"${param.id}": ${this.format(param.value)}`);
        }
      });
    if (paramsList.length > 0) {
      script += ', params={';
      script += paramsList.join(',');
      script += this.end() + '}';
    }
    return script;
  }

}
