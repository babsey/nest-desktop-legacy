import { Connection } from './connection';
import { drawPath } from './connectionGraph';


export class ConnectionView {
  connection: Connection;                         // parent
  colorExcitation: string = '#595289'; //'#467ab3';
  colorInhibition: string = '#AF143C'; //'#b34846';

  constructor(connection: Connection) {
    this.connection = connection;
  }

  get backgroundImage(): string {
    const bg: string = 'white'; //'#fafafa';
    const srcColor: string = this.connection.source.view.color;
    const tgtColor: string = this.connection.target.view.color;
    const gradient: string = ['120deg', srcColor, srcColor, bg, bg, tgtColor, tgtColor].join(', ');
    return 'linear-gradient(' + gradient + ')';
  }

  colorWeight(): string {
    const value: number = this.connection.synapse.weight;
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
    if (this.connection.source === this.connection.target) {
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

  // getBackgroundImage(): string {
  //   const bg: string = '#fafafa';
  //   const srcColor: string = this.connection.source.view.color;
  //   const tgtColor: string = this.connection.target.view.color;
  //   const gradient: string = ['150deg', srcColor, srcColor, bg, bg, tgtColor, tgtColor].join(', ');
  //   return 'linear-gradient(' + gradient + ')';
  // }

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
    return (
      this.connection.source.model.elementType === "spike_detector" ||
      this.connection.target.model.elementType === "spike_detector"
    );
  }

  drawPath(): string {
    const source: any = this.connection.source.view.position,
      target: any = this.connection.target.view.position,
      config: any = {
        radius: this.connection.source.config.data.graph.radius.value,
        ellipticalArc: this.connection.config.data.graph.ellipticalArc.value,
        xAxisRotation: this.connection.config.data.graph.xAxisRotation.value,
      };
    return drawPath(source, target, config);
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
