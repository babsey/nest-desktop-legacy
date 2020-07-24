import { Activity } from '../activity';


export class AnimData {
  activity: Activity;                     // parent

  layout: any = {};
  frames: any[] = [];
  config: any = {};

  constructor(activity: Activity, config: any = {}) {
    this.activity = activity;
    this.config = config;
    this.init();
  }

  init(): void {
    this.layout['extent'] = [
      // [-this.activities.length * 2 - 1, this.activities.length * 2],
      [-1, 0],
      [-.5, .5],
      [.5, -.5]
    ];
  }

  update(): void {
    // console.log('Update activities animation')
    this.frames = [];
    if (this.activity.recorder.model.existing === 'spike_detector') {
      this.plotSpikeData();
    } else {
      this.plotAnalogData();
    }
  }

  get positions(): any {
    const x: number[] = [],
      y: number[] = [];
    this.activity.recorder.events.senders.map(sender => {
      const pos: number[] = this.activity.nodePositions[this.activity.nodeIds.indexOf(sender)];
      x.push(pos[0]);
      y.push(pos[1]);
    });
    return { x: x, y: y };
  }

  plotSpikeData(): void {
    const times: number[] = this.activity.recorder.events.times;
    const pos: any = this.positions;
    this.scatterFrames(times, pos.x, pos.y);
  }

  plotAnalogData(): void {
    const sourceData: number[] = this.activity.recorder.events['V_m'];
    // const rangeData: number[] = [-70., -55.];
    const times: number[] = this.activity.recorder.events.times;
    const pos: any = this.positions;
    this.scatterFrames(times, pos.x, pos.y, sourceData);
  }

  scatterFrames(x: number[], y: number[], z: number[], color: number[] = []): void {
    const sampleRate: number = this.config.frames.sampleRate;
    const nframes: number = this.activity.recorder.network.project.simulation.kernel.time * sampleRate;
    if (this.frames.length == 0) {
      for (let i = 0; i < nframes; i++) {
        this.frames.push({
          frame: i,
          data: [],
        })
      }
    }

    this.frames.forEach(frame => {
      frame.data.push({
        x: [], y: [], z: [], color: []
      })
      frame.data[frame.data.length - 1].idx = frame.data.length - 1;
    })

    x.map((xi, i) => {
      const frameIdx: number = Math.floor(xi * sampleRate);
      const frame: any = this.frames[frameIdx];
      if (frame === undefined) return
      const idx: number = frame.data.length - 1;
      frame.data[idx].x.push(x[i]);
      frame.data[idx].y.push(y[i]);
      frame.data[idx].z.push(z[i]);
      frame.data[idx].color.push(color[i] || this.activity.recorder.view.color);
    })

  }

}
