import * as d3 from 'd3';

import { Activity } from '../activity';
import { ActivityGraph } from '../activityGraph';
import { Project } from '../../project/project';


export class ActivityAnimationGraph extends ActivityGraph {
  _frames: any[] = [];
  layout: any = {
    extent: [
      [-1, 0],
      [-.5, .5],
      [.5, -.5]
    ]
  };

  source: string = 'spike';
  sources: any[] = [];

  config: any = {
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
      idx: 0,
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
  
  style: any = {};
  data: any[];

  trailModes: string[] = ['off', 'growing', 'shrinking', 'temporal'];
  colorScales: any = {
    'spectral': d3.interpolateSpectral,
    // 'turbo': d3.interpolateTurbo,
    'viridis': d3.interpolateViridis,
    'inferno': d3.interpolateInferno,
    'magma': d3.interpolateMagma,
    'plasma': d3.interpolatePlasma,
    // 'cividis': d3.interpolateCividis,
    'warm': d3.interpolateWarm,
    'cool': d3.interpolateCool,
    'cubehelix': d3.interpolateCubehelixDefault,
  };

  constructor(project: Project, config: any = {}) {
    super(project);
    this.init();
    this.update();
  }

  get frames(): any[] {
    return this._frames;
  }

  getFrame(): any[] {
    return this.frames[this.config.frames.idx] || { data: [] };
  }

  init(): void {
    console.log('Init activity animation');
    this._frames = [];
  }

  update(): void {
    console.log('Update activity animation');
    this._frames = [];
    this.project.activities.forEach(activity => {
      if (activity.recorder.model.existing === 'spike_detector') {
        this.plotSpikeData(activity);
      } else {
        this.plotAnalogData(activity);
      }
    })
  }

  hasAnalogData(): boolean {
    return this.project.activities.filter(activity => activity.hasAnalogData()).length > 0;
  }

  color(value: any): string {
    if (typeof value === 'string') {
      return value;
    }
    const min: number = this.config.colorMap.min;
    const max: number = this.config.colorMap.max;
    const colorScale: any = this.colorScales[this.config.colorMap.scale];
    return colorScale((value - min) / (max - min))
  }

  plotSpikeData(activity: Activity): void {
    const times: number[] = activity.recorder.events.times;
    const pos: any = activity.getPositionsForSenders();
    this.addFrames(times, pos.x, pos.y, activity.recorder.view.color);
  }

  plotAnalogData(activity: Activity): void {
    const sourceData: number[] = activity.recorder.events['V_m'];
    // const rangeData: number[] = [-70., -55.];
    const times: number[] = activity.recorder.events.times;
    const pos: any = activity.getPositionsForSenders();
    this.addFrames(times, pos.x, pos.y, sourceData);
  }

  addFrames(x: number[], y: number[], z: number[], color: string | number[]): void {
    const sampleRate: number = this.config.frames.sampleRate;
    const nframes: number = this.endtime * sampleRate;

    // Add empty frames if not existed
    if (this.frames.length === 0) {
      for (let i = 0; i < nframes - 1; i++) {
        this._frames.push({
          frame: i,
          data: [],
        })
      }
    }

    // Add empty data (from individual recorder) for each frame
    this._frames.forEach(frame => {
      frame.data.push({
        x: [], y: [], z: [], color: []
      })
      frame.data[frame.data.length - 1].idx = frame.data.length - 1;
    })

    // Add values in data
    x.map((xi, i) => {
      const frameIdx: number = Math.floor(xi * sampleRate);
      const frame: any = this._frames[frameIdx - 1];
      if (frame === undefined) return
      const idx: number = frame.data.length - 1;
      frame.data[idx].x.push(x[i]);
      frame.data[idx].y.push(y[i]);
      frame.data[idx].z.push(z[i]);
      frame.data[idx].color.push(typeof color === 'string' ? color : color[i]);
    })
  }

  updateConfig(): void {
    console.log('Update config in activity animation graph')
    const activities: string[][] = this.project.activities.map(activity =>
      Object.keys(activity.recorder.events).filter(val => !(['senders', 'times'].includes(val)))
    );
    let sources: any[] = [].concat(...activities);
    if (sources.length === 0) {
      this.source = 'spike';
      this.sources = [];
    } else {
      sources = sources.filter(this.onlyUnique);
      if (this.source === 'spike') {
        this.source = sources.includes('V_m') ? 'V_m' : sources[0];
        this.config.frames.sampleRate = 1;
        this.config.frames.windowSize = 1;
        this.config.trail.length = 0;
      }
      if (sources.length == 1) {
        this.config.sources = [];
      } else {
        sources.sort();
        this.sources = sources.map(source => { return { value: source, label: source } });
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
