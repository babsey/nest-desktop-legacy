// import { Config } from '../config';
import { Node } from '../node/node';


export class Activity {
  recorder: Node;                       // parent
  idx: number;                          // generative

  // Information of the recorded nodes;
  events: any = {};
  nodeIds: number[] = [];
  nodePositions: number[][] = [];       // if spatial

  constructor(
    recorder: Node,
    activity: any = { events: {}, nodeIds: [], nodePositions: [] }
  ) {
    this.recorder = recorder;
    this.update(activity);
  }

  get elementTypes(): string[] {
    return this.recorder.nodes.map((node: Node) => node.model.elementType);
  }

  get endtime(): number {
    return this.recorder.network.project.simulation.kernel.time;
  }

  get senders(): number[] {
    const senders: any[] = [...new Set(this.events.senders)];
    if (senders.length > 0) {
      senders.sort((a: number, b: number) => a - b);
    }
    return senders;
  }

  get nEvents(): number {
    return this.events.hasOwnProperty('times') ? this.events.times.length : 0;
  }

  hasEvents(): boolean {
    return this.nEvents > 0;
  }

  update(activity: any): void {
    this.events = activity.events || {};
    this.nodeIds = activity.nodeIds || [];
    this.nodePositions = activity.nodePositions || [];
  }

  hasAnalogData(): boolean {
    return ['voltmeter', 'multimeter'].includes(this.recorder.model.existing);
  }

  hasInputAnalogData(): boolean {
    return this.hasAnalogData() && this.elementTypes.includes('stimulator');
  }

  hasNeuronAnalogData(): boolean {
    return this.hasAnalogData() && this.elementTypes.includes('neuron');
  }

  hasSpikeData(): boolean {
    return this.recorder.model.existing === 'spike_detector';
  }

  getPositionsForSenders(): any {
    const x: number[] = [];
    const y: number[] = [];
    this.events.senders.map((sender: number) => {
      const pos: number[] = this.nodePositions[this.nodeIds.indexOf(sender)];
      if (pos) {
        x.push(pos[0]);
        y.push(pos[1]);
      }
    });
    return { x: x, y: y };
  }

  download(): void {
    this.recorder.network.project.app.download(this, 'activity');
  }

  downloadEvents(): void {
    this.recorder.network.project.app.download(this.events, 'events');
  }

  toJSON(): any {
    const activity: any = {
      events: this.events,
      nodeIds: this.nodeIds,
      nodePositions: this.nodePositions,
    };
    return activity;
  }

}
