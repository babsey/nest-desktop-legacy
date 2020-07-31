import { Code } from '../code';
import { Synapse } from './synapse';
import { Model } from '../model/model';


export class SynapseCode extends Code {
  synapse: Synapse;                 // parent

  constructor(synapse: Synapse) {
    super();
    this.synapse = synapse;
  }

  synSpec(): string {
    const synSpecList: string[] = [];
    if (this.synapse.modelId !== 'static_synapse') {
      synSpecList.push(this._() + '"model": "' + this.synapse.modelId + '"');
    }
    this.synapse.params
      .filter(param => param.visible)
      .forEach(param => synSpecList.push(this._() + '"' + param.id + '": ' + this.format(param.value)));

    let script: string = '';
    if (synSpecList.length > 0) {
      script += ', syn_spec={';
      script += synSpecList.join(',');
      script += this.end() + '}';
    }
    return script;
  }

}
