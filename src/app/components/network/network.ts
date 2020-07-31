import { Config } from '../config';
import { Connection } from '../connection/connection';
import { Model } from '../model/model';
import { NetworkCode } from './networkCode';
import { NetworkView } from './networkView';
import { Node } from '../node/node';
import { Project } from '../project/project';


export class Network {
  project: Project;                     // parent
  config: Config;                       // config
  view: NetworkView;                    // view
  code: NetworkCode;                    // code

  nodes: Node[] = [];                   // for nest.Create
  connections: Connection[] = [];       // for nest.Connect

  constructor(project: Project, network: any = {}) {
    this.project = project;
    this.config = new Config(this.constructor.name);
    this.code = new NetworkCode(this);
    this.view = new NetworkView(this);

    this.nodes = [];
    this.connections = [];

    network.nodes ? network.nodes.forEach(node => this.addNode(node)) : null;
    network.connections ? network.connections.forEach(connection => this.addConnection(connection)) : null;

    this.clean();
  }

  get stimulators(): Node[] {
    return this.nodes.filter(node => node.model.elementType === 'stimulator')
  }

  get neurons(): Node[] {
    return this.nodes.filter(node => node.model.elementType === 'neuron')
  }

  get recorders(): Node[] {
    return this.nodes.filter(node => node.model.elementType === 'recorder')
  }

  addNode(node: any): void {
    this.nodes.push(new Node(this, node));
  }

  addConnection(connection: any): void {
    this.connections.push(new Connection(this, connection));
  }

  deleteNode(node: Node): void {
    this.view.resetFocus();
    this.view.resetSelection();
    this.connections = this.connections.filter(c => (c.source !== node && c.target !== node));
    // this.nodes = this.nodes.filter(n => n.idx !== node.idx);
    const idx: number = node.idx;
    this.nodes = this.nodes.slice(0, idx).concat(this.nodes.slice(idx + 1));
    this.clean();
  }

  deleteConnection(connection: Connection): void {
    this.view.resetFocus();
    this.view.resetSelection();
    // this.connections = this.connections.filter(c => c.idx !== connection.idx);
    const idx: number = connection.idx;
    this.connections = this.connections.slice(0, idx).concat(this.connections.slice(idx + 1));
    this.clean();
  }

  clean(): void {
    this.nodes.forEach(node => node.clean());
    this.connections.forEach(connection => connection.clean());
  }

  copy(item: any): any {
    return JSON.parse(JSON.stringify(item));
  }

  clone(): Network {
    return new Network(this.project, this);
  }

  serialize(to: string): any {
    const network: any = {
      nodes: this.nodes.map(node => node.serialize(to)),
      connections: this.connections.map(connection => connection.serialize(to)),
    };
    return network;
  }

}
