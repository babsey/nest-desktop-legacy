import * as math from 'mathjs';

import { Activity } from '../activity';
import { ActivityChartGraph } from '../activityChartGraph';
import { Config } from '../../config';


export class ActivityGraphPanel extends Config {
  private static readonly _name = 'ActivityGraphPanel';
  private _activities: Activity[] = [];
  private _data: any[] = [];
  private _graph: ActivityChartGraph;        // parent
  private _icon = 'chart-line';
  private _label = 'graph panel of activity';
  private _layout: any = {
    xaxis: {
      showgrid: true,
      title: 'Time [ms]',
    },
    yaxis: {
      showgrid: true,
      title: '',
      height: 1,
    },
  };
  private _name = '';
  private _visible = true;
  private _xaxis = 1;

  constructor(graph: ActivityChartGraph, configName: string = null) {
    super(configName || 'ActivityGraphPanel');
    this._graph = graph;
  }

  get activities(): Activity[] {
    return this._activities;
  }

  set activities(value: Activity[]) {
    this._activities = value;
  }

  get data(): any[] {
    return this._data;
  }

  set data(value: any[]) {
    this._data = value;
  }

  get graph(): ActivityChartGraph {
    return this._graph;
  }

  get icon(): string {
    return this._icon;
  }

  set icon(value: string) {
    this._icon = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get idx(): number {
    return this.graph.panels.indexOf(this);
  }

  get layout(): any {
    return this._layout;
  }

  get label(): string {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
  }

  get state(): any {
    return {};
  }

  get visible(): boolean {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
  }

  get xaxis(): number {
    return this._xaxis;
  }

  set xaxis(value: number) {
    this._xaxis = value;
  }

  get yaxis(): number {
    return this.idx + 1;
  }

  hasActivities(): boolean {
    return this.activities.length > 0;
  }

  init(): void {
    this.activities = this.graph.project.activities;
    this.data = [];
  }

  update(): void {
  }

  updateColor(): void {
  }

  updateLayout(): void {
    const height: number = this.layout.yaxis.height;
    const panels: ActivityGraphPanel[] = this.graph.panels;
    const heights: number[] = panels.map((panel: ActivityGraphPanel) => panel.layout.yaxis.height);
    const heightTotal: number = math.sum(heights);
    heights.reverse();
    const ratio: number = 1. / heightTotal - (panels.length * 0.02);
    const heightCumsum: number[] = heights.map(((sum: number) => (value: number) => sum += value)(0));
    const steps = heightCumsum.map((h: number) => h / heightTotal);
    steps.unshift(0);
    steps.reverse();
    const margin: number = this.xaxis === 1 ? 0.02 : 0.07;
    const domain: number[] = [steps[this.yaxis], steps[this.yaxis - 1] - margin];
    this.layout.yaxis.domain = domain;
    this.layout.xaxis.anchor = 'y' + this.yaxis;
  }

}
