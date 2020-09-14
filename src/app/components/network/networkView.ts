import { Connection } from '../connection/connection';
import { Network } from './network';
import { Node } from '../node/node';


export class NetworkView {
  network: Network;                    // parent
  private _focusedConnection: Connection | null = null;
  private _focusedNode: Node | null = null;
  private _selectedConnection: Connection | null = null;
  private _selectedElementType: string | null = null;
  private _selectedNode: Node | null = null;

  constructor(network: Network) {
    this.network = network;
  }

  get focusedConnection(): Connection | null {
    return this._focusedConnection;
  }

  set focusedConnection(connection: Connection | null) {
    this._focusedNode = null;
    this._focusedConnection = connection;
  }

  get focusedNode(): Node | null {
    return this._focusedNode;
  }

  set focusedNode(node: Node | null) {
    this._focusedConnection = null;
    this._focusedNode = node;
  }

  get selectedConnection(): Connection | null {
    return this._selectedConnection;
  }

  set selectedConnection(connection: Connection | null) {
    this._selectedElementType = null;
    this._selectedNode = null;
    this._selectedConnection = this._selectedConnection === connection ? null : connection;
  }

  get selectedElementType(): string | null {
    return this._selectedElementType;
  }

  set selectedElementType(value: string | null) {
    this.resetSelection();
    this._selectedElementType = value;
    // this._selectedElementType = this._selectedElementType === elementType ? null : elementType;
  }

  get selectedNode(): Node | null {
    return this._selectedNode;
  }

  set selectedNode(node: Node | null) {
    this._selectedElementType = null;
    this._selectedConnection = null;
    this._selectedNode = (this._selectedNode === node) ? null : node;
  }

  get colors(): string[] {
    return this.network.config.color.cycle;
  }

  set colors(value: string[]) {
    const color: any = this.network.config.color;
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
    if (this.selectedElementType === null) { return true; }
    return this.selectedElementType === elementType;
  }

  hasPositions(): boolean {
    return this.network.nodes.some((node: Node) => node.spatial.hasPositions());
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
      if (!withConnection) { return false; }
      const connections: Connection[] = node.network.connections
        .filter((connection: Connection) => connection.source.idx === node.idx || connection.target.idx === node.idx);
      return connections.some((connection: Connection) => connection === this.selectedConnection);
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
