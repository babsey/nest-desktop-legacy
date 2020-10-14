import * as d3 from 'd3';

import { Activity } from './activity';
import { Project } from '../project/project';


export class ActivityAnimationGraph {
  private _config: any;
  private _frameIdx = 0;
  private _frames: any[] = [];
  private _hash: string;
  private _layout: any = {};
  private _project: Project;
  private _recordables: string[] = [];
  private _recordablesOptions: any[] = [];
  private _recordFrom = 'V_m';
  private _style: any = {};
  private _trailModes: string[];

  constructor(project: Project, config: any = {}) {
    this._project = project;
    this._hash = project.hash;
    this._config = {
      camera: {
        position: {
          x: 16,
          y: 8,
          z: 8,
        },
        distance: 12,
        rotation: {
          theta: 0,
          speed: 0
        },
        control: false,
      },
      layer: {
        offset: {
          x: 0,
          y: 0,
          z: 0
        }
      },
      colorMap: {
        min: -70,
        max: -55,
        reverse: false,
        scale: 'Spectral',
      },
      frames: {
        sampleRate: 1,
        speed: 1,
        rate: 24,
        windowSize: 1,
      },
      trail: {
        mode: 'off',
        length: 0,
        fading: false,
      },
      objectSize: 4,
      opacity: 1,
      flatHeight: false,
      flyingBoxes: false,
    };

    this._layout = {
      extent: [
        [-1, 0],
        [-.5, .5],
        [.5, -.5]
      ]
    };

    this._trailModes = ['off', 'growing', 'shrinking'];

    this.init();
    // this.update();
  }

  get config(): any {
    return this._config;
  }

  get endtime(): number {
    return this._project.simulation.kernel.time;
  }

  get frame(): any {
    return this.frames[this._frameIdx] || { data: [] };
  }

  get frameIdx(): number {
    return this._frameIdx;
  }

  set frameIdx(value: number) {
    this._frameIdx = value;
  }

  get frames(): any[] {
    return this._frames;
  }

  get hash(): string {
    return this._hash;
  }

  set hash(value: string) {
    this._hash = value;
  }

  get layout(): any {
    return this._layout;
  }

  get project(): Project {
    return this._project;
  }

  get recordables(): string[] {
    return this._recordables;
  }

  get recordablesOptions(): any[] {
    return this._recordablesOptions;
  }

  get recordFrom(): string {
    return this._recordFrom;
  }

  set recordFrom(value: string) {
    this._recordFrom = value;
  }

  get style(): any {
    return this._style;
  }

  init(): void {
    // console.log('Init activity animation');
    this._frames = [];
    this._recordables = [];
    this._recordablesOptions = [];
    this._recordFrom = 'V_m';
  }

  update(): void {
    // console.log('Update activity animation graph');
    this.init();
    this.initFrames();
    this.project.activities.forEach((activity: Activity) => {
      this.updateFrames(activity);
    });
    this._recordablesOptions = this._recordables.map((recordable: string) => ({ value: recordable }));
  }

  hasAnyAnalogData(): boolean {
    return this.project.activities.some((activity: Activity) => activity.hasAnalogData());
  }

  hasAnySpikeData(): boolean {
    return this.project.activities.some((activity: Activity) => activity.hasSpikeData());
  }

  ratio(value: number): number {
    const min: number = this._config.colorMap.min;
    const max: number = this._config.colorMap.max;
    return (value - min) / (max - min);
  }

  color(value: number): string {
    const colorScale: any = d3['interpolate' + this._config.colorMap.scale];
    return colorScale((this._config.colorMap.reverse ? 1 - value : value));
  }

  initFrames(): void {
    // Add empty frames if not existed
    const sampleRate: number = this._config.frames.sampleRate;
    const nframes: number = this.endtime * sampleRate;
    if (this._frames.length === 0) {
      for (let i = 0; i < nframes - 1; i++) {
        const frame: any = {
          frameIdx: i,
          data: [],
        };
        this._frames.push(frame);
      }
    }
  }

  updateFrames(activity: Activity): void {
    const events: any = JSON.parse(JSON.stringify(activity.events));
    events.senders = events.senders.map((sender: number) => activity.nodeIds.indexOf(sender));
    const eventKeys: string[] = Object.keys(events);
    eventKeys.forEach((eventKey: string) => {
      if (!this._recordables.includes(eventKey) && !['senders', 'times'].includes(eventKey)) {
        this._recordables.push(eventKey);
      }
    });

    // Add empty data (from individual recorder) in each frame
    this._frames.forEach((frame: any) => {
      const data: any = {};
      eventKeys.forEach((eventKey: string) => {
        data[eventKey] = [];
      });
      data.activityIdx = activity.idx;
      frame.data.push(data);
      frame.data[frame.data.length - 1].idx = frame.data.length - 1;
    });

    // Push values in data frames
    const sampleRate: number = this._config.frames.sampleRate;
    events.times.forEach((time: number, idx: number) => {
      const frameIdx: number = Math.floor(time * sampleRate);
      const frame: any = this._frames[frameIdx - 1];
      if (frame === undefined) { return; }
      const data: any = frame.data[activity.idx];
      eventKeys.forEach((eventKey: string) => {
        data[eventKey].push(events[eventKey][idx]);
      });
    });
  }

  increment(): void {
    this.config.frames.speed += 1;
  }

  decrement(): void {
    this.config.frames.speed -= 1;
  }

  stop(): void {
    this.config.frames.speed = 0;
  }

  play(): void {
    this.config.frames.speed = 1;
  }

  backplay(): void {
    this.config.frames.speed = -1;
  }

  stepBackward(): void {
    this.stop();
    const framesLength: number = this._frames.length;
    this._frameIdx = (this._frameIdx - 1 + framesLength) % framesLength;
  }

  step(): void {
    this.stop();
    const framesLength: number = this._frames.length;
    this._frameIdx = (this._frameIdx + 1) % framesLength;
  }

}
