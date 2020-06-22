export class SimModel {
  new: string;
  existing: string;
  params: any;
  modelDefaults: any = {
    stimulator: 'dc_generator',
    neuron: 'iaf_psc_alpha',
    recorder: 'voltmeter',
  };

  constructor(data: any = {}, elementType: string) {
    this.new = data.new;
    this.existing = data['existing'] || this.modelDefaults[elementType];
    this.params = data['params'] || {};
  }
}
