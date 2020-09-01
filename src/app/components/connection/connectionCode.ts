import { Code } from '../code';
import { Connection } from './connection';
import { Node } from '../node/node';
import { Model } from '../model/model';
import { Parameter } from '../parameter';


export class ConnectionCode extends Code {
  connection: Connection;                 // parent

  constructor(connection: Connection) {
    super();
    this.connection = connection;
  }

  get sourceLabel(): string {
    return this.connection.source.code.label;
  }

  get targetLabel(): string {
    return this.connection.target.code.label;
  }

  connSpec(): string {
    const connSpecList: string[] = [this._() + `"rule": "${this.connection.rule}"`];
    this.connection.params.forEach((param: Parameter) => connSpecList.push(this._() + `"${param.id}": ${param.value}`));

    let script: string = ', conn_spec={';
    script += connSpecList.join(',');
    script += this.end() + '}';
    return script;
  }

  connect(): string {
    let sourceNode: Node = this.connection.source;
    let targetNode: Node = this.connection.target;
    const targetModel: Model = targetNode.model;
    if (['multimeter', 'voltmeter'].includes(targetModel.id)) {
      [sourceNode, targetNode] = [targetNode, sourceNode];
    }

    let script: string = '';
    script += `nest.Connect(${this.sourceLabel}, ${this.targetLabel}`;
    script += this.connSpec();
    script += this.connection.synapse.code.synSpec();
    script += ')';
    return script + '\n';
  }

}
