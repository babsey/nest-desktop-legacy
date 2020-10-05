import * as d3 from 'd3';

import { Activity } from './activity';
import { ActivityGraph } from './activityGraph';
import { Project } from '../project/project';


export class ActivityAnimationGraph extends ActivityGraph {
  private _colorScales: any;
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

    this._colorScales = {
      spectral: d3.interpolateSpectral,
      // turbo: d3.interpolateTurbo,
      viridis: d3.interpolateViridis,
      inferno: d3.interpolateInferno,
      magma: d3.interpolateMagma,
      plasma: d3.interpolatePlasma,
      // cividis: d3.interpolateCividis,
      warm: d3.interpolateWarm,
      cool: d3.interpolateCool,
      cubehelix: d3.interpolateCubehelixDefault,
    };

    this.config = {
      camera: {
        position: {
          x: 16,
          y: 0,
          z: 0,
        },
        distance: 24,
        rotation: {
          theta: 0,
          speed: 0
        },
        control: true,
      },
      colorMap: {
        min: -70,
        max: -55,
        scale: 'spectral',
      },
      frames: {
        sampleRate: 1,
        speed: 1,
        rate: 30,
        windowSize: 1,
      },
      trail: {
        mode: 'off',
        length: 10,
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

    this._trailModes = ['off', 'growing', 'shrinking', 'temporal'];

    this.init();
    this.update();
  }

  get colorScales(): any {
    return this._colorScales;
  }

  get config(): any {
    return this._config;
  }

  set config(value: any) {
    this._config = value;
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

  getFrame(): any[] {
    return this.frames[this._frameIdx] || { data: [] };
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

  color(value: any): string {
    if (typeof value === 'string') {
      return value;
    }
    const min: number = this._config.colorMap.min;
    const max: number = this._config.colorMap.max;
    const colorScale: any = this._colorScales[this._config.colorMap.scale];
    return colorScale((value - min) / (max - min));
  }

  plotSpikeData(activity: Activity): void {
    const times: number[] = activity.events.times;
    const pos: any = activity.getPositionsForSenders();
    this.addFrames(times, pos.x, pos.y, activity.recorder.view.color);
  }

  plotAnalogData(activity: Activity): void {
    const sourceData: number[] = activity.events.V_m;
    // const rangeData: number[] = [-70., -55.];
    const times: number[] = activity.events.times;
    const pos: any = activity.getPositionsForSenders();
    this.addFrames(times, pos.x, pos.y, sourceData);
  }

  addFrames(x: number[], y: number[], z: number[], color: string | number[]): void {
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
        x: [], y: [], z: [], color: []
      });
      frame.data[frame.data.length - 1].idx = frame.data.length - 1;
    });

    // Add values in data
    x.map((xVal: number, xIdx: number) => {
      const frameIdx: number = Math.floor(xVal * sampleRate);
      const frame: any = this._frames[frameIdx - 1];
      if (frame === undefined) { return; }
      const idx: number = frame.data.length - 1;
      frame.data[idx].x.push(x[xIdx]);
      frame.data[idx].y.push(y[xIdx]);
      frame.data[idx].z.push(z[xIdx]);
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

  stop(): void {
    this.config.frames.speed = 0;
  }

  play(): void {
    this.config.frames.speed = 1;
  }

}
