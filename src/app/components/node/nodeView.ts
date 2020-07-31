import { Connection } from '../connection/connection';
import { Node } from './node';


export class NodeView {
  node: Node;                 // parent

  // for the app
  _color: any;                   // color of node
  _label: string;
  position: any = { x: 0, y: 0 };

  // From Simulator
  positions: number[][] = [];


  constructor(node: Node, view: any) {
    this.node = node;
    this._color = view.color;
    this.position = view.position;
  }

  get label(): string {
    if (this._label) return this._label;
    const elementType: string = this.node.model.elementType;
    if (elementType === 'neuron') {
      const idx: number = this.node.network.neurons.indexOf(this.node);
      return 'n' + (idx + 1);
    } else {
      const nodes: Node[] = this.node.network.nodes.filter(node => node.modelId === this.node.modelId);
      const idx: number = nodes.indexOf(this.node);
      const label: string[] = this.node.model.id.split('_');
      return label.map(l => l[0]).join('') + (idx + 1);
    }
  }

  set label(value: string) {
    this._label = value;
  }

  get color(): string {
    if (typeof this._color === 'string') {
      return this._color;
    }

    if (this.node.model.elementType === 'recorder') {
      const connections: Connection[] = this.node.network.connections
        .filter(connection => (connection.source.idx === this.node.idx || connection.target.idx === this.node.idx));
      if (connections.length === 1 && connections[0].source.idx !== connections[0].target.idx) {
        const connection: Connection = connections[0];
        let node: Node = connection.source.idx === this.node.idx ? connection.target : connection.source;
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

  get weight(): string {
    if (this.node.model.elementType === 'recorder') return
    const connections: Connection[] = this.node.network.connections.filter(connection => connection.source.idx === this.node.idx && connection.target.model.elementType !== 'recorder');
    if (connections.length > 0) {
      const weights: number[] = connections.map(connection => connection.synapse.weight);
      if (weights.every(weight => weight > 0)) return 'excitatory';
      if (weights.every(weight => weight < 0)) return 'inhibitory';
    }
  }

  get backgroundImage(): string {
    const bg: string = '#fafafa';
    const color: string = this.color;
    const gradient: string = ['90deg', color, color, bg].join(', ');
    return 'linear-gradient(' + gradient + ')';
  }

  paramsVisible(): string[] {
    return this.node.params.filter(param => param.visible).map(param => param.id);
  }

  setLevel(level: number): void {
    this.node.params.map(param => param.visible = param.options.level <= level)
  }

  clean(): void {
  }

  select(): void {
    this.node.network.view.selectedNode = this.node;
  }

  focus(): void {
    this.node.network.view.focusedNode = this.node;
  }

  isSelected(unselected: boolean = false): boolean {
    return this.node.network.view.isNodeSelected(this.node, unselected)
  }

  isFocused(): boolean {
    return this.node.network.view.isNodeFocused(this.node);
  }

  isRecorder(): boolean {
    return this.node.model.elementType == 'recorder';
  }

  hasEvents(): boolean {
    return Object.keys(this.node.events).length > 0;
  }

  getSquarePoints(radius: number): string {
    const a: number = radius / 2. * Math.sqrt(Math.PI);
    const points: string = [[-a, -a].join(','), [a, -a].join(','), [a, a].join(','), [-a, a].join(',')].join(' ');
    return points;
  }

  anglePoint(deg: number, radius: number, y0: number = 0): number[] {
    const radian: number = deg / 180 * Math.PI;
    return [Math.cos(radian) * radius, y0 + Math.sin(radian) * radius];
  }

  getTrianglePoints(radius: number): string {
    const a: number = radius * Math.sqrt(Math.PI / 2);
    const p0: number[] = this.anglePoint(-90, a, 4);
    const p1: number[] = this.anglePoint(-210, a, 4);
    const p2: number[] = this.anglePoint(-330, a, 4);
    // const points: string = [[-x,y].join(','),[2*x,0].join(','),[-x,-y].join(',')].join(',');
    const points: string = [p0.join(','), p1.join(','), p2.join(',')].join(',');
    return points;
  }

  getLayerPoints(radius: number): string {
    const a: number = radius + 4;
    const b: number = radius - 4;
    const points: string = [[a, 0].join(','), [0, b].join(','), [-a, 0].join(','), [0, -b].join(',')].join(' ');
    return points;
  }

  serialize(): any {
    const nodeView: any = {
      color: this._color,
      position: this.position,
    };
    return nodeView;
  }

}
