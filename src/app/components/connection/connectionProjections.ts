import { Config } from '../config';
import { Connection } from './connection';


enum ConnectionType {
  convergent,
  divergent,
}

export class ConnectionProjections extends Config {
  private _connection: Connection;

  private _allowAutapses: boolean;
  private _allowMultapses: boolean;
  private _allowOversizedMask: boolean;
  private _connectionType: string;
  private _delays: any;
  private _kernel: any;
  private _numberOfConnections: number;
  private _weights: any;

  constructor(connection: Connection, projections: any = {}) {
    super('ConnectionProjections');
    this._connection = connection;

    this._allowAutapses = projections.allowAutapses || false;
    this._allowMultapses = projections.allowMultapses || false;
    this._allowOversizedMask = projections.allowOversizedMask || false;
    this._connectionType = projections.connectionType || 'convergent';
    this._delays = projections.delays || 1;
    this._kernel = projections.kernel || 1;
    this._numberOfConnections = projections.numberOfConnections || 1;
    this._weights = projections.weights || 1;
  }

  get allowAutapses(): boolean {
    return this._allowAutapses;
  }

  set allowAutapses(value: boolean) {
    this._allowAutapses = value;
  }

  get allowMultapses(): boolean {
    return this._allowMultapses;
  }

  set allowMultapses(value: boolean) {
    this._allowMultapses = value;
  }

  get allowOversizedMask(): boolean {
    return this._allowOversizedMask;
  }

  set allowOversizedMask(value: boolean) {
    this._allowOversizedMask = value;
  }

  get connection(): Connection {
    return this._connection;
  }

  get connectionType(): string {
    return this._connectionType;
  }

  set connectionType(value: string) {
    this._connectionType = value;
  }

  get delays(): any {
    return this._delays;
  }

  set delays(value: any) {
    this._delays = value;
  }

  get numberOfConnections(): number {
    return this._numberOfConnections;
  }

  set numberOfConnections(value: number) {
    this._numberOfConnections = value;
  }

  get kernel(): any {
    return this._kernel;
  }

  set kernel(value: any) {
    this._kernel = value;
  }

  get weights(): any {
    return this._weights;
  }

  set weights(value: any) {
    this._weights = value;
  }

  reset(): void {
    this._connectionType = 'convergent';
    this._delays = 1;
    this._kernel = 1;
    this._numberOfConnections = 1;
    this._weights = 1;
  }

  toJSON(target: string = 'db') {
    const projections: any = {
      kernel: this._kernel,
      weights: this._weights,
      delays: this._delays,
    };
    if (target === 'simulator') {
      projections.number_of_connections = this._numberOfConnections;
      projections.connection_type = this._connectionType;
      projections.allow_autapses = this._allowAutapses;
      projections.allow_multapses = this._allowMultapses;
      projections.allow_oversized_mask = this._allowOversizedMask;
    } else {
      projections.numberOfConnections = this._numberOfConnections;
      projections.connectionType = this._connectionType;
      projections.allowAutapses = this._allowAutapses;
      projections.allowMultapses = this._allowMultapses;
      projections.allowOversizedMask = this._allowOversizedMask;
    }
    return projections;
  }

}
