import * as d3 from 'd3';

import { Activity } from './activity';
import { ActivityGraph } from './activityGraph';
import { Project } from '../project/project';


export class ActivityAnimationGraph extends ActivityGraph {
  private _config: any;
  private _frameIdx = 0;
  private _frames: any[] = [];
  private _layout: any = {};
  private _source = 'spike';
  private _sources: any[] = [];
  private _style: any = {};
  private _trailModes: string[];

  constructor(project: Project, config: any = {}) {
    super(project);

    this.config = {
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
        rate: 30,
        windowSize: 1,
      },
      trail: {
        mode: 'off',
        length: 0,
        fading: false,
      },
      dotSize: 10,
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
    this.update();
  }

  get config(): any {
    return this._config;
  }

  set config(value: any) {
    this._config = value;
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

  get layout(): any {
    return this._layout;
  }

  get source(): string {
    return this._source;
  }

  set source(value: string) {
    this._source = value;
  }

  get sources(): string[] {
    return this._sources;
  }

  get style(): any {
    return this._style;
  }

  init(): void {
    // console.log('Init activity animation');
    this._frames = [];
  }

  update(): void {
    // console.log('Update activity animation');
    this._frames = [];
    this.project.activities.forEach((activity: Activity) => {
      if (activity.hasSpikeData()) {
        this.plotSpikeData(activity);
      } else {
        this.plotAnalogData(activity);
      }
    });
  }

  hasAnyAnalogData(): boolean {
    return this.project.activities.some((activity: Activity) => activity.hasAnalogData());
  }

  hasAnySpikeData(): boolean {
    return this.project.activities.some((activity: Activity) => activity.hasSpikeData());
  }

  color(value: any): string {
    if (typeof value === 'string') {
      return value;
    }
    const min: number = this._config.colorMap.min;
    const max: number = this._config.colorMap.max;
    const x: number = (value - min) / (max - min);
    const colorScale: any = d3['interpolate' + this._config.colorMap.scale];
    return colorScale((this._config.colorMap.reverse ? 1 - x : x));
  }

  plotSpikeData(activity: Activity): void {
    const times: number[] = activity.events.times;
    const senders: number[] = activity.events.senders.map((sender: number) => activity.nodeIds.indexOf(sender));
    const color: string = activity.recorder.view.color;
    this.addFrames(times, senders, color);
  }

  plotAnalogData(activity: Activity, recordFrom: string = 'V_m'): void {
    // const rangeData: number[] = [-70., -55.];
    const times: number[] = activity.events.times;
    const senders: number[] = activity.events.senders.map((sender: number) => activity.nodeIds.indexOf(sender));
    const color: number[] = activity.events[recordFrom];
    this.addFrames(times, senders, color);
  }

  addFrames(times: number[], senders: number[], color: string | number[]): void {
    const sampleRate: number = this._config.frames.sampleRate;
    const nframes: number = this.endtime * sampleRate;

    // Add empty frames if not existed
    if (this._frames.length === 0) {
      for (let i = 0; i < nframes - 1; i++) {
        this._frames.push({
          frame: i,
          data: [],
        });
      }
    }

    // Add empty data (from individual recorder) for each frame
    this._frames.forEach((frame: any) => {
      frame.data.push({
        senders: [], times: [], color: []
      });
      frame.data[frame.data.length - 1].idx = frame.data.length - 1;
    });

    // Add values in data
    times.map((xVal: number, xIdx: number) => {
      const frameIdx: number = Math.floor(xVal * sampleRate);
      const frame: any = this._frames[frameIdx - 1];
      if (frame === undefined) { return; }
      const idx: number = frame.data.length - 1;
      frame.data[idx].times.push(times[xIdx]);
      frame.data[idx].senders.push(senders[xIdx]);
      frame.data[idx].color.push(typeof color === 'string' ? color : color[xIdx]);
    });
  }

  updateConfig(): void {
    // console.log('Update config in activity animation graph')
    const activities: string[][] = this.project.activities.map((activity: Activity) =>
      Object.keys(activity.events).filter((val: string) =>
        !(['senders', 'times'].includes(val)))
    );
    let sources: any[] = [];
    sources = sources.concat(...activities);
    if (sources.length === 0) {
      this._source = 'spike';
      this._sources = [];
    } else {
      if (this._source === 'spike') {
        this._source = sources.includes('V_m') ? 'V_m' : sources[0];
        this._config.frames.sampleRate = 1;
        this._config.frames.windowSize = 1;
        this._config.trail.length = 0;
      }
      if (sources.length === 1) {
        this._config.sources = [];
      } else {
        sources.sort();
        this._sources = sources.map((source: string) => ({ value: source, label: source }));
      }
    }
  }

  onlyUnique(values: any[], index: number, self): boolean {
    return self.indexOf(values) === index;
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
