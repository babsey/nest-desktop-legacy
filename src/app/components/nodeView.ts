import { Spatial } from './spatial';
import { Parameter } from './parameter';
import { Model } from './model';
import { Random } from './random';
import { Connection } from './connection';
import { Node } from './node';


export class NodeView {
  node: Node;                 // parent

  // for the app
  _color: any;                   // color of node
  position: any = { x: 0, y: 0 };

  // From Simulator
  positions: number[][] = [];
  globalIds: number[] = [];


  constructor(node: Node, view: any) {
    this.node = node;
    this._color = view.color;
    this.position = view.position;
  }

  get label(): string {
    const abc: string = 'abcdefghijklmnopqrstuvwxyz123456789';
    return abc[this.node.idx];
  }

  get color(): string {
    if (typeof this._color === 'string') {
      return this._color;
    }

    let node: Node = this.node;
    if (node.model.elementType === 'recorder') {
      const connections: Connection[] = node.network.connections
        .filter(connection => (connection.source.idx === node.idx || connection.target.idx === node.idx));
      if (connections.length === 1 && connections[0].source.idx !== connections[0].target.idx) {
        const connection: Connection = connections[0];
        node = connection[connection.source.idx === node.idx ? 'target' : 'source'];
      }
    }
    const colors: string[] = this.node.network.view.colors;
    return colors[node.idx % colors.length];
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

  paramsVisible(): string[] {
    return this.node.params.filter(param => param.visible).map(param => param.id);
  }

  setLevel(level: number): void {
    this.node.params.map(param => param.visible = param.options.level <= level)
  }

  clean(): void {
    this.globalIds = [];
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

  setSpatial(): void {
    // this.node.spatial = new Spatial({
    //   'edge_wrap': false,
    //   extent: [1, 1],
    //   center: [0, 0],
    //   positions: positions,
    // });
    this.node.network.clean();
  }

  unsetSpatial(): void {
    // this.node.spatial = undefined;
    this.node.network.clean();
  }

  isSpatial(): boolean {
    return false; //Object.keys(this.spatial).length > 0;
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
