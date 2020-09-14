import { Code } from '../code';
import { Node } from './node';
import { Parameter } from '../parameter';
// import { ParameterRandom } from '../parameterRandom';


export class NodeCode extends Code {
  node: Node;                           // parent

  constructor(node: Node) {
    super();
    this.node = node;
  }

  get label(): string {
    return this.node.view.label;
  }

  get simulatorVersion(): string {
    return this.node.network.project.app.nestServer.state.simulatorVersion;
  }

  create(): string {
    let script = '';
    script += `${this.label} = nest.Create("${this.node.modelId}"`;
    if (!this.node.spatial.hasPositions() || this.node.spatial.isRandom()) {
      script += `, ${this.node.size}`;
    }
    script += this.nodeParams();
    if (!this.simulatorVersion.startsWith('2.') && this.node.spatial.hasPositions()) {
      script += this.nodeSpatial();
    }
    script += ')';
    return script + '\n';
  }

  getActivity(): string {
    let script = '{';
    const model: string = this.node.model ? this.node.model.existing : this.node.modelId;
    // Make it backward compatible with older NEST Server.
    if (this.simulatorVersion.startsWith('2.')) {
      script += this._(2) + `"events": nest.GetStatus(${this.label}, "events")[0],`;        // NEST 2
      if (model === 'spike_detector') {
        script += this._(2) + `"nodeIds": nest.GetStatus(nest.GetConnections(None, ${this.label}),  "source"),`;
      } else {
        script += this._(2) + `"nodeIds": nest.GetStatus(nest.GetConnections(${this.label}), "target")`;
      }
    } else {
      script += this._(2) + `"events": ${this.label}.get("events"),`;                    // NEST 3
      if (model === 'spike_detector') {
        script += this._(2) + `"nodeIds": list(nest.GetConnections(None, ${this.label}).sources()),`;
      } else {
        script += this._(2) + `"nodeIds": list(nest.GetConnections(${this.label}).targets())`;
      }
    }
    script += this._() + '}';
    return script;
  }

  isRandom(value: any): boolean {
    return value.constructor === Object && value.hasOwnProperty('parameterType');
  }

  XOR(a: boolean, b: boolean): boolean {
    return (a || b) && !(a && b);
  }

  nodeParams(): string {
    let script = '';
    if (this.node.params === undefined || this.node.params.length === 0) { return script; }
    const paramsList: string[] = [];
    this.node.params
      .filter((param: Parameter) => param.visible)
      .forEach((param: Parameter) => {
        paramsList.push(this._() + `"${param.id}": ${this.format(param.value)}`);
      });
    if (this.node.model.existing === 'multimeter') {
      const recordFrom: string[] = this.node.recordFrom.map((record: string) => '"' + record + '"');
      paramsList.push(this._() + `"record_from": [${recordFrom.join(',')}]`);
    }
    if (paramsList.length > 0) {
      script += ', params={';
      script += paramsList.join(',');
      script += this.end() + '}';
    }
    return script;
  }

  nodeSpatial(): string {
    let script = '';
    script += ', positions=';
    const positions = this.node.spatial.toJSON();
    if (this.node.spatial.positions.name === 'free') {
      if (false && positions.pos.length > 0) {
        script += `nest.spatial.free([${positions.pos.map((p: number[]) => `[${p[0].toFixed(2)},${p[1].toFixed(2)}]`).join(',')}])`;
      } else {
        script += `nest.spatial.free(nest.random.uniform(-0.5, 0.5), num_dimensions=2)`;
      }
    } else {
      script += `nest.spatial.grid(${JSON.stringify(positions.shape)})`;
    }
    return script;
  }

}
