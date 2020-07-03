export class SimNode {
  label: string;
  model: string;
  n: number;
  params: any;
  spatial?: any;
  element_type: string;
  rows?: number;
  columns?: number;

  constructor(
    data: any = {},
  ) {
    var modelDefaults: any = {
      stimulator: 'dc_generator',
      neuron: 'iaf_psc_alpha',
      recorder: 'voltmeter',
    };

    this.model = data.model || modelDefaults[data.element_type];
    this.n = data.n || 1;
    this.params = data.params || {};
    this.spatial = data.spatial || {};
    this.element_type = data.element_type;
    this.rows = data.rows;
    this.columns = data.columns;
  }

  clean(data: any): void {
    this.setLabel(data.simulation.collections.indexOf(this))
    this.updateParamsFromModel(data)
  }

  updateParamsFromModel(data: any): void {
    if (!data.simulation.models.hasOwnProperty(this.model)) return
    var model = data.simulation.models[this.model];
    Object.keys(model.params).map(param => {
      if (!this.params.hasOwnProperty(param)) {
        this.params[param] = model.params[param];
      }
    })
  }

  setLabel(idx: number): void {
    var abc = 'abcdefghijklmnopqrstuvwxyz123456789';
    this.label = abc[idx];
  }

  // Boolean functions

  isSpatial(): boolean {
    return Object.keys(this.spatial).length > 0;
  }
}
