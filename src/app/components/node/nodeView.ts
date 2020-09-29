import { Connection } from '../connection/connection';
import { Node } from './node';
import { Parameter } from '../parameter';
import * as NodeGraph from './nodeGraph';


export class NodeView {
  private _node: Node;                 // parent

  // for the app
  private _color: any;                   // color of node
  private _label: string;
  private _position: any = { x: 0, y: 0 };

  // From Simulator
  positions: number[][] = [];


  constructor(node: Node, view: any) {
    this._node = node;
    this._color = view.color;
    this._position = view.position;
  }

  get color(): string {
    if (typeof this._color === 'string') { return this._color; }

    if (this.node.model.elementType === 'recorder') {
      const connections: Connection[] = this.node.network.connections
        .filter(
          (connection: Connection) => (connection.source.idx === this.node.idx || connection.target.idx === this.node.idx));
      if (connections.length === 1 && connections[0].source.idx !== connections[0].target.idx) {
        const connection: Connection = connections[0];
        const node: Node = (connection.source.idx === this.node.idx) ? connection.target : connection.source;
        return node.view.color;
      }
    }

    const colors: string[] = this.node.network.view.colors;
    return colors[this.node.idx % colors.length];
  }

  set color(value: string) {
    this._color = value === 'none' ? undefined : value;
    this.node.network.clean();
  }

  get label(): string {
    if (this._label) { return this._label; }

    const elementType: string = this.node.model.elementType;
    if (elementType === undefined) {
      const idx: number = this.node.network.nodes.indexOf(this.node);
      return 'n' + (idx + 1);
    } else if (elementType === 'neuron') {
      const idx: number = this.node.network.neurons.indexOf(this.node);
      return 'n' + (idx + 1);
    } else {
      const nodes: Node[] = this.node.network.nodes.filter(
        (node: Node) => node.modelId === this.node.modelId);
      const idx: number = nodes.indexOf(this.node);
      const label: string = this.node.model.abbreviation || this.node.modelId.split('_').map((d: string) => d[0]).join('');
      return label + (idx + 1);
    }
  }

  get node(): Node {
    return this._node;
  }

  get position(): any {
    return this._position;
  }

  get weight(): string {
    if (this._node.model.elementType === 'recorder') { return; }
    const connections: Connection[] = this._node.network.connections.filter(
      (connection: Connection) => connection.source.idx === this._node.idx && connection.target.model.elementType !== 'recorder');
    if (connections.length > 0) {
      const weights: number[] = connections.map(
        (connection: Connection) => connection.synapse.weight);
      if (weights.every((weight: number) => weight > 0)) { return 'excitatory'; }
      if (weights.every((weight: number) => weight < 0)) { return 'inhibitory'; }
    }
  }

  get backgroundImage(): string {
    const bg = '#fafafa';
    const color: string = this.color;
    const gradient: string = ['90deg', color, color, bg].join(', ');
    return 'linear-gradient(' + gradient + ')';
  }

  getPoints(radius: number): string {
    switch (this._node.model.elementType) {
      case 'stimulator':
        return NodeGraph.getPoints('hexagon', radius);
        break;
      case 'recorder':
        return NodeGraph.getPoints('rectangle', radius);
        break;
      case 'neuron':
        const weight: string = this.weight;
        if (weight === 'excitatory') {
          return NodeGraph.getPoints('triangle', radius);
        } else if (weight === 'inhibitory') {
          return NodeGraph.getPoints('circle', radius);
        } else {
          return NodeGraph.getPoints('square', radius);
        }
        break;
      default:
        return NodeGraph.getPoints('', radius);
    }
  }

  paramsVisible(): string[] {
    return this._node.params.filter((param: Parameter) => param.visible).map(param => param.id);
  }

  setLevel(level: number): void {
    this._node.params.map((param: Parameter) => param.visible = param.options.level <= level);
  }

  clean(): void {
  }

  select(): void {
    this._node.network.view.selectedNode = this._node;
  }

  focus(): void {
    this._node.network.view.focusedNode = this._node;
  }

  isSelected(unselected: boolean = false): boolean {
    return this._node.network.view.isNodeSelected(this._node, unselected);
  }

  isFocused(): boolean {
    return this._node.network.view.isNodeFocused(this._node);
  }

  toJSON(): any {
    const nodeView: any = {
      color: this._color,
      position: this._position,
    };
    return nodeView;
  }

}
