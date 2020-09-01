// import { Config } from '../config';
import { Node } from '../node/node';


export class Activity {
  recorder: Node;                       // parent
  // config: Config;                       // config
  idx: number;                          // generative

  // Information of the recorded nodes;
  nodeIds: number[] = [];
  nodePositions: number[][] = [];       // if spatial

  constructor(recorder: Node, activity: any = {}) {
    this.recorder = recorder;
    // this.config = new Config(this.constructor.name);
    this.idx = this.recorder.network.project.activities.length;
    this.update(activity)
  }

  get elementTypes(): string[] {
    return this.recorder.nodes.map(node => node.model.elementType);
  }

  get endtime(): number {
    return this.recorder.network.project.simulation.kernel.time;
  }

  update(activity: any): void {
    this.nodeIds = activity.nodeIds !== undefined ? activity.nodeIds : [];
    this.nodePositions = activity.nodePositions !== undefined ? activity.nodePositions : [];
  }

  hasAnalogData(): boolean {
    return ['voltmeter', 'multimeter'].includes(this.recorder.model.existing) && this.elementTypes.includes('neuron');
  }

  hasInputData(): boolean {
    return ['voltmeter', 'multimeter'].includes(this.recorder.model.existing) && this.elementTypes.includes('stimulator');
  }

  hasSpikeData(): boolean {
    return this.recorder.model.existing === 'spike_detector';
  }

  getPositionsForSenders(): any {
    const x: number[] = [],
      y: number[] = [];
    this.recorder.events.senders.map(sender => {
      const pos: number[] = this.nodePositions[this.nodeIds.indexOf(sender)];
      if (pos) {
        x.push(pos[0]);
        y.push(pos[1]);
      }
    });
    return { x: x, y: y };
  }

  download(): void {
    this.recorder.network.project.app.download(this.serialize(), 'activity');
  }

  serialize(): any {
    const activity: any = {
      events: this.recorder.events,
      nodeIds: this.nodeIds,
      nodePositions: this.nodePositions,
    };
    return activity;
  }

}
