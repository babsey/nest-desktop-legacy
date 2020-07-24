import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { AnimationControllerService } from '../animation-controller/animation-controller.service';
import { ColorService } from '../../../network/services/color.service';
import { LogService } from '../../../log/log.service';
import { MathService } from '../../../services/math/math.service';
import { VisualizationService } from '../../visualization.service';

import { Project } from '../../../components/project';
import { Activity } from '../../../components/activity';


@Component({
  selector: 'app-animation-analog',
  templateUrl: './animation-analog.component.html',
  styleUrls: ['./animation-analog.component.scss']
})
export class AnimationAnalogComponent implements OnInit, OnDestroy {
  @Input() activities: Activity[];
  public data: any[] = [];
  public frames: any[] = [];
  public layout: any = {};
  private subscription: any;

  constructor(
    private _mathService: MathService,
    private _logService: LogService,
    private _visualizationService: VisualizationService,
    private _animationControllerService: AnimationControllerService,
    public _colorService: ColorService,
  ) {
  }

  ngOnInit() {
    // console.log('Activity visualization on init')
    this.subscription = this._visualizationService.update.subscribe(() => this.update())
    this.init()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  init(): void {
    this.layout['extent'] = [
      // [-this.activities.length * 2 - 1, this.activities.length * 2],
      [-1, 0],
      [-.5, .5],
      [.5, -.5]
    ];
    this.update()
  }

  update(): void {
    // console.log('Update activities animation')
    this.data = [];
    this.frames = [];
    if (this.activities.length == 0) return
    this._logService.log('Prepare frames');

    this.activities
      .filter(activity => ['multimeter', 'voltmeter'].includes(activity.recorder.modelId))
      .map(activity =>  this.plotAnalogData(activity))

    this._animationControllerService.frames.length = this.frames.length;
    this._animationControllerService.play()
  }

  plotAnalogData(activity: Activity): void {
    if (activity.nodePositions.length === 0) return
    const positions: number[][] = activity.nodePositions;
    const nodeIds: number[] = activity.nodeIds;

    const source: string = this._animationControllerService.source;
    const sourceData: number[] = activity.recorder.events[source];
    const rangeData: number[] = this._mathService.extent(sourceData);
    this._animationControllerService.colorMap.min = Math.floor(rangeData[0]);
    this._animationControllerService.colorMap.max = Math.ceil(rangeData[1]);

    const x: number[] = activity.recorder.events.times,
      y: number[] = [],
      z: number[] = [];
    activity.recorder.events.senders.map((sender, i) => {
      const pos: number[] = positions[nodeIds.indexOf(sender)];
      z.push(pos[1])
      y.push(pos[0])
    })
    this.scatterFrames(x, y, z, sourceData);
  }

  scatterFrames(x: number[], y: number[], z: number[], color: number[]): void {
    const sampleRate: number = this._animationControllerService.frames.sampleRate;
    const nframes: number = this._visualizationService.time * sampleRate;
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
    this.data.push(this.frames[0].data[0])

    x.forEach((xi, i) => {
      const frameIdx: number = Math.floor(xi * sampleRate);
      const frame: any = this.frames[frameIdx];
      if (frame === undefined) return
      const idx: number = frame.data.length - 1;
      // frame.data[frame.data.length - 1].x.push(frame.data.length - 1)
      frame.data[idx].x.push(x[i])
      frame.data[idx].y.push(y[i])
      frame.data[idx].z.push(z[i])
      frame.data[idx].color.push(color[i])
    })

  }
}
