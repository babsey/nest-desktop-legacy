// import { Config } from '../config';
import { Node } from '../node/node';


export class Activity {
  private _recorder: Node;                       // parent
  private _idx: number;                          // generative

  // Information of the recorded nodes;
  private _events: any = {};
  private _nodeIds: number[] = [];
  private _nodePositions: number[][] = [];       // if spatial

  constructor(
    recorder: Node,
    activity: any = { events: {}, nodeIds: [], nodePositions: [] }
  ) {
    this._recorder = recorder;
    this.update(activity);
  }

  get elementTypes(): string[] {
    return this._recorder.nodes.map((node: Node) => node.model.elementType);
  }

  get endtime(): number {
    return this._recorder.network.project.simulation.kernel.time;
  }

  get events(): any {
    return this._events;
  }

  set events(value: any) {
    this._events = value;
  }

  get idx(): number {
    return this._idx;
  }

  get nEvents(): number {
    return this._events.hasOwnProperty('times') ? this._events.times.length : 0;
  }

  get nodeIds(): number[] {
    return this._nodeIds;
  }

  set nodeIds(value: number[]) {
    this._nodeIds = value;
  }

  get nodePositions(): number[][] {
    return this._nodePositions;
  }

  set nodePositions(value: number[][]) {
    this._nodePositions = value;
  }

  get recorder(): Node {
    return this._recorder;
  }

  get senders(): number[] {
    const senders: any[] = [...new Set(this._events.senders)];
    if (senders.length > 0) {
      senders.sort((a: number, b: number) => a - b);
    }
    return senders;
  }

  hasEvents(): boolean {
    return this.nEvents > 0;
  }

  update(activity: any, idx: number = null): void {
    if (idx !== null) {
      this._idx = idx;
    }
    this._events = activity.events || {};
    this._nodeIds = activity.nodeIds || [];
    this._nodePositions = activity.nodePositions || [];
  }

  hasAnalogData(): boolean {
    return ['voltmeter', 'multimeter'].includes(this._recorder.model.existing);
  }

  hasInputAnalogData(): boolean {
    return this.hasAnalogData() && this.elementTypes.includes('stimulator');
  }

  hasNeuronAnalogData(): boolean {
    return this.hasAnalogData() && this.elementTypes.includes('neuron');
  }

  hasSpikeData(): boolean {
    return this._recorder.model.existing === 'spike_detector';
  }

  getPositionsForSenders(): any {
    const x: number[] = [];
    const y: number[] = [];
    this._events.senders.map((sender: number) => {
      const pos: number[] = this._nodePositions[this._nodeIds.indexOf(sender)];
      if (pos) {
        x.push(pos[0]);
        y.push(pos[1]);
      }
    });
    return { x, y };
  }

  download(): void {
    this._recorder.network.project.app.download(this, 'activity');
  }

  downloadEvents(): void {
    this._recorder.network.project.app.download(this._events, 'events');
  }

  toJSON(): any {
    const activity: any = {
      events: this._events,
      nodeIds: this._nodeIds,
      nodePositions: this._nodePositions,
    };
    return activity;
  }

}
