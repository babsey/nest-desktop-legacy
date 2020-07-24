import { Config } from './config';
import { Node } from './node';


export class Activity {
  recorder: Node;                       // parent
  idx: number;                          // generative
  config: Config;                       // config

  // Information of the recorded nodes;
  nodeIds: number[] = [];
  nodePositions: number[][] = [];       // if spatial

  // deprecated
  layout: any = {};


  constructor(recorder: Node, activity: any = {}) {
    this.recorder = recorder;
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
    this.nodeIds = activity.nodeIds ? activity.nodeIds : [];
    this.nodePositions = activity.nodePositions ? activity.nodePositions : [];
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
