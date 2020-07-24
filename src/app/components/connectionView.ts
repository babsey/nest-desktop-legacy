import { Config } from './config'
import { Connection } from './connection';


export class ConnectionView {
  connection: any;                         // parent
  colorExcitation: string = '#467ab3';
  colorInhibition: string = '#b34846';
  config: Config;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  colorWeight(): string {
    const value = this.connection.syn_spec ? this.connection.syn_spec.weight : 1;
    if (value === 0) return 'black';
    return value > 0 ? this.colorExcitation : this.colorInhibition;
  }

  isSelected(): boolean {
    return this.connection.network.view.isConnectionSelected(this.connection);
  }

  isFocused(): boolean {
    return this.connection.network.view.isConnectionFocused(this.connection);
  }

  distance(): number {
    if (this.connection._source === this.connection._target) {
      return 0;
    };
    const source: any = this.connection.source.view.position,
      target: any = this.connection.target.view.position;
    const x1: number = source.x,
      y1: number = source.y,
      x2: number = target.x,
      y2: number = target.y;
    const dx: number = x2 - x1,
      dy: number = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  probabilistic(): boolean {
    return !['all_to_all', 'one_to_one'].includes(this.connection.rule);
  }

  getBackgroundImage(): string {
    const bg: string = '#fafafa';
    const srcColor: string = this.connection.source.view.color;
    const tgtColor: string = this.connection.target.view.color;
    const gradient: string = ['150deg', srcColor, srcColor, bg, bg, tgtColor, tgtColor].join(', ');
    return 'linear-gradient(' + gradient + ')';
  }

  select(): void {
    this.connection.network.view.selectedConnection = this.connection;
  }

  focus(): void {
    this.connection.network.view.focusedConnection = this.connection;
  }

  connectRecorder(): boolean {
    return this.connection.source.model.elementType === 'recorder' || this.connection.target.model.elementType === 'recorder';
  }

  connectSpikeDetector(): boolean {
    return this.connection.target.model === 'spike_detector';
  }

  drawPath(): string {

    const source: any = this.connection.source.view.position,
      target: any = this.connection.target.view.position;

    let x1: number = source.x,
      y1: number = source.y,
      x2: number = target.x,
      y2: number = target.y;

    const dx: number = x2 - x1,
      dy: number = y2 - y1,
      dr: number = Math.sqrt(dx * dx + dy * dy),
      r: number = this.connection.source.config.data.graph.radius + 5;

    // Defaults for normal edge.
    const ellipticalArc: number = this.connection.config.data.graph.ellipticalArc.value,
      xAxisRotation: number = this.connection.config.data.graph.xAxisRotation.value;

    let drx: number = dr * ellipticalArc * 2,
      dry: number = dr * ellipticalArc,
      largeArc: number = 0, // 1 or 0
      sweep: number = 0; // 1 or 0

    // Self edge.
    if (x1 === x2 && y1 === y2) {
      // Fiddle with this angle to get loop oriented.

      // Needs to be 1.
      largeArc = 1;

      // Change sweep to change orientation of loop.
      sweep = 0;

      // Make drx and dry different to get an ellipse
      // instead of a circle.
      drx = 30;
      dry = 15;

      // For whatever reason the arc collapses to a point if the beginning
      // and ending points of the arc are the same, so kludge it.
      x1 = x1 - .1;
      x2 = x2 + .1;
    }
    return 'M' + x1 + ',' + y1 + 'A' + drx + ',' + dry + ' ' + xAxisRotation + ',' + largeArc + ',' + sweep + ' ' + x2 + ',' + y2;
  };

  getRuleParams(): any[] {
    const rule: any = this.connection.config.data.rules.find(rule => rule.value === this.connection.rule);
    return this.copy(rule.params) || [];
  }

  copy(item: any): any {
    return JSON.parse(JSON.stringify(item));
  }

  getRuleParamConfig(id: string): any {
    const params: any[] = this.getRuleParams();
    return params.find(param => param.id === id) || {};
  }

}
