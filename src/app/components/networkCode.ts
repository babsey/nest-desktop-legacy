import { Code } from './code';
import { Network } from './network';


export class NetworkCode extends Code {
  network: Network;                           // parent

  constructor(network: Network) {
    super();
    this.network = network;
  }

  createNodes(): string {
    let script: string = '';
    this.network.nodes.forEach(node => script += node.code.create());
    return script;
  }

  connectNodes(): string {
    let script: string = '';
    this.network.connections.forEach(connection => script += connection.code.connect());
    return script;
  }

  getActivities(): string {
    let script: string = '';
    script += 'response = {';
    script += this._() + '"kernel": {"time": nest.GetKernelStatus("time")},'
    script += this._() + '"activities": [';
    const activities: string[] = this.network.recorders.map(node => node.code.getActivity());
    script += activities.join(',');
    script += ']';
    script += this.end() + '}';
    return script + '\n';
  }

}
