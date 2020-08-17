import { Connection } from '../connection/connection';
import { Network } from './network';
import { Node } from '../node/node';


export class NetworkView {
  network: Network;                    // parent
  private _focusedConnection: Connection = null;
  private _focusedNode: Node = null;
  private _selectedConnection: Connection = null;
  private _selectedElementType: string = null;
  private _selectedNode: Node = null;

  constructor(network: Network) {
    this.network = network;
  }

  get focusedConnection(): Connection {
    return this._focusedConnection;
  }

  set focusedConnection(connection: Connection) {
    this._focusedNode = null;
    this._focusedConnection = connection;
  }

  get focusedNode(): Node {
    return this._focusedNode;
  }

  set focusedNode(node: Node) {
    this._focusedConnection = null;
    this._focusedNode = node;
  }

  get selectedConnection(): Connection {
    return this._selectedConnection;
  }

  set selectedConnection(connection: Connection) {
    this.selectedElementType = null;
    this.selectedNode = null;
    this._selectedConnection = this._selectedConnection === connection ? null : connection;
  }

  get selectedElementType(): string {
    return this._selectedElementType;
  }

  set selectedElementType(elementType: string) {
    this.resetSelection();
    this._selectedElementType = elementType;
    // this._selectedElementType = this._selectedElementType == elementType ? null : elementType;
  }

  get selectedNode(): Node {
    return this._selectedNode;
  }

  set selectedNode(node: Node) {
    this._selectedElementType = null;
    this._selectedConnection = null;
    this._selectedNode = this._selectedNode === node ? null : node;
  }

  get colors(): string[] {
    return this.network.config.data.color.cycle;
  }

  set colors(value: string[]) {
    const color: any = this.network.config.data.color;
    color.cycle = value;
    this.network.config.update({ color: color });
  }

  resetFocus(): void {
    this._focusedNode = null;
    this._focusedConnection = null;
  }

  resetSelection(): void {
    this._selectedNode = null;
    this._selectedConnection = null;
  }

  isElementTypeSelected(elementType: string): boolean {
    if (this.selectedElementType === null) return true;
    return this.selectedElementType === elementType;
  }

  hasPositions(): boolean {
    return this.network.nodes.some(node => node.spatial.hasPositions());
  }

  //
  // Node
  //

  isNodeFocused(node: Node): boolean {
    return this.focusedNode === node;
  }

  isNodeSelected(node: Node, unselected: boolean = true, withConnection: boolean = true): boolean {
    if (this.selectedNode) {
      return this.selectedNode === node;
    } else if (this.selectedConnection) {
      if (!withConnection) return false;
      const connections: Connection[] = node.network.connections
        .filter(connection => connection.source.idx === node.idx || connection.target.idx === node.idx);
      return connections.some(connection => connection === this.selectedConnection);
    }
    return unselected;
  }


  //
  // Connection
  //

  isConnectionFocused(connection: Connection, unselected: boolean = true): boolean {
    if (this.focusedConnection) {
      return this.focusedConnection === connection;
    } else if (this.focusedNode) {
      return this.focusedNode.idx === connection.source.idx;
    }
    return unselected;
  }

  isConnectionSelected(connection: Connection, unselected: boolean = true): boolean {
    if (this.selectedConnection) {
      return this.selectedConnection === connection;
    } else if (this.selectedNode) {
      return this.selectedNode.idx === connection.source.idx;
    }
    return unselected;
  }

}
