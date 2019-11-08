import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { AnimationControllerService } from '../animation-controller/animation-controller.service';
import { ColorService } from '../../../network/services/color.service';
import { LogService } from '../../../log/log.service';
import { MathService } from '../../../services/math/math.service';
import { VisualizationService } from '../../visualization.service';

import { Record } from '../../../classes/record';


@Component({
  selector: 'app-animation-spike',
  templateUrl: './animation-spike.component.html',
  styleUrls: ['./animation-spike.component.scss']
})
export class AnimationSpikeComponent implements OnInit, OnDestroy {
  @Input() records: Record[];
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
    // console.log('Record visualization on init')
    this.subscription = this._visualizationService.update.subscribe(() => this.update())
    this.init()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  init(): void {
    this.layout['extent'] = [
      // [-this.records.length * 2 - 1, this.records.length * 2],
      [-1, 0],
      [-.5, .5],
      [.5, -.5]
    ];
    this.update()
  }

  update(): void {
    // console.log('Update records animation')
    this.data = [];
    this.frames = [];
    if (this.records.length == 0) return

    var spikeRecords = this.records.filter(record => record.recorder.model == 'spike_detector');
    if (spikeRecords.length == 0) return
    this._logService.log('Prepare frames');

    spikeRecords.map(record =>  this.plotSpikeData(record));
    this._animationControllerService.frames.length = this.frames.length;
    this._animationControllerService.play()
  }

  plotSpikeData(record: Record): void {
    if (!record.hasOwnProperty('positions') || !record.hasOwnProperty('global_ids')) return
    if (record.positions.length == 0) return
    var positions = record.positions;
    var global_ids = record.global_ids;

    var x: number[] = record.events.times;
    var y: number[] = [];
    var z: number[] = [];
    record.events.senders.map(sender => {
      var pos = positions[global_ids.indexOf(sender)];
      y.push(pos[0])
      z.push(pos[1])
    })
    this.scatterFrames(x, y, z, record.recorder.color);
  }

  scatterFrames(x: number[], y: number[], z: number[], color: string): void {
    var sampleRate = this._animationControllerService.frames.sampleRate;
    var nframes = this._visualizationService.time * sampleRate;
    if (this.frames.length == 0) {
      for (var i = 0; i < nframes; i++) {
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

    x.map((xi, i) => {
      var frameIdx = Math.floor(xi * sampleRate);
      var frame = this.frames[frameIdx];
      if (frame == undefined) return

      var idx = frame.data.length - 1;
      frame.data[idx].x.push(x[i])
      frame.data[idx].y.push(y[i])
      frame.data[idx].z.push(z[i])
      frame.data[idx].color.push(color)
    })

  }
}
