import { Config } from '../config';
import { Connection } from '../connection/connection';
import { Model } from '../model/model';
import { NetworkCode } from './networkCode';
import { NetworkView } from './networkView';
import { Node } from '../node/node';
import { Project } from '../project/project';


export class Network extends Config {
  project: Project;                     // parent
  view: NetworkView;                    // view
  code: NetworkCode;                    // code

  nodes: Node[] = [];                   // for nest.Create
  connections: Connection[] = [];       // for nest.Connect

  constructor(project: Project, network: any = {}) {
    super('Network');
    this.project = project;
    this.code = new NetworkCode(this);
    this.view = new NetworkView(this);

    this.nodes = [];
    this.connections = [];

    if (network.nodes) {
      network.nodes.forEach((node: any) => this.addNode(node));
    }
    if (network.connections) {
      network.connections.forEach((connection: any) => this.addConnection(connection));
    }

    this.clean();
  }

  get stimulators(): Node[] {
    return this.nodes.filter((node: Node) => node.model.elementType === 'stimulator');
  }

  get neurons(): Node[] {
    return this.nodes.filter((node: Node) => node.model.elementType === 'neuron');
  }

  get recorders(): Node[] {
    return this.nodes.filter((node: Node) => node.model.isRecorder());
  }

  commit(): void {
    this.project.commitNetwork(this);
  }

  oldest(): void {
    this.project.networkOldest();
  }

  older(): void {
    this.project.networkOlder();
  }

  newer(): void {
    this.project.networkNewer();
  }

  newest(): void {
    this.project.networkNewest();
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
    this.connections = this.connections.filter((c: Connection) => (c.source !== node && c.target !== node));
    // this.nodes = this.nodes.filter((n: Node) => n.idx !== node.idx);
    const idx: number = node.idx;
    this.nodes = this.nodes.slice(0, idx).concat(this.nodes.slice(idx + 1));
    this.clean();
  }

  deleteConnection(connection: Connection): void {
    this.view.resetFocus();
    this.view.resetSelection();
    // this.connections = this.connections.filter((c: Connection) => c.idx !== connection.idx);
    const idx: number = connection.idx;
    this.connections = this.connections.slice(0, idx).concat(this.connections.slice(idx + 1));
    this.clean();
  }

  clean(): void {
    this.nodes.forEach((node: Node) => node.clean());
    this.connections.forEach((connection: Connection) => connection.clean());
  }

  copy(item: any): any {
    return JSON.parse(JSON.stringify(item));
  }

  clone(): Network {
    return new Network(this.project, this);
  }


  /**
   * Clears the network by deleting every node and every connection.
   */
  empty(): void {
    this.view.resetFocus();
    this.view.resetSelection();
    this.connections = [];
    this.nodes = [];
    // this.connections.forEach((connection: Connection) => this.deleteConnection(connection));
    // this.nodes.forEach((node: Node) => this.deleteNode(node));
    this.clean();
    this.commit();
  }

  isEmpty(): boolean {
    return this.nodes.length === 0 && this.connections.length === 0;
  }

  toJSON(target: string = 'db'): any {
    const network: any = {
      nodes: this.nodes.map((node: Node) => node.toJSON(target)),
      connections: this.connections.map((connection: Connection) => connection.toJSON(target)),
    };
    return network;
  }

}
