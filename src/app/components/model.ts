import { App } from './app';
import { Config } from './config';
import { Parameter } from './parameter';
import { ModelCode } from './modelCode';


export class Model {
  app: App;                             // parent
  idx: number;                          // generative
  code: ModelCode;

  id: string;
  existing: string;
  elementType: string;
  label: string;
  params: Parameter[] = [];
  recordables: string[];

  constructor(app: App, model: any) {
    this.app = app;
    this.idx = this.app.models.length;
    this.code = new ModelCode(this);

    this.id = model.id;
    this.elementType = model.elementType || model.element_type;
    this.existing = model.existing || model.id;
    this.label = model.label || '';
    model.params.forEach(param => this.addParameter(param));
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

  serialize(to: string): any {
    const model: any = {
      existing: this.existing,
    };
    if (to === 'simulator') {
      model['new'] = this.id;
      model['params'] = {};
      this.params.forEach(p => model.params[p.id] = p.value);
    } else {
      model['id'] = this.id;
      model['elementType'] = this.elementType;
      model['label'] = this.label;
      model['params'] = this.params.map(param => param.serialize());
      if (this.recordables.length > 0) {
        model['recordables'] = this.recordables;
      }
      model['version'] = this.app.version;
    }
    return model;
  }

}
