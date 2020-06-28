import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { AnimationControllerService } from './animation/animation-controller/animation-controller.service'
import { LogService } from '../log/log.service';
import { SimulationControllerService } from '../simulation/simulation-controller/simulation-controller.service';
import { VisualizationService } from './visualization.service';

import { Data } from '../classes/data';
import { Record } from '../classes/record';


@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent implements OnInit, OnDestroy {
  @Input() data: Data;
  @Input() layout: any = {};
  @Input() kernel: any = {};
  @Input() records: Record[];
  private subscription: any;

  constructor(
    private _logService: LogService,
    private _simulationControllerService: SimulationControllerService,
    public _animationControllerService: AnimationControllerService,
    public _visualizationService: VisualizationService,
  ) {
  }

  ngOnInit(): void {
    this.subscription = this._visualizationService.update.subscribe(() => this.update());
    this.update()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  update(): void {
    this._logService.log('Update visualization');
    // console.log('Visualization update')
    if (this._visualizationService.mode == 'animation') {
      var sources = [].concat(this.records.map(record =>
        Object.keys(record.events).filter(val => !(['senders', 'times'].includes(val)))
      ))[0];
      if (sources.length == 0) {
        this._animationControllerService.source = 'spike';
        this._animationControllerService.sources = [];
        // this._animationControllerService.frames.sampleRate = 10;
        // this._animationControllerService.frames.windowSize = 10;
      } else {
        sources = sources.filter(this.onlyUnique);
        if (this._animationControllerService.source == 'spike') {
          this._animationControllerService.source = sources.includes('V_m') ? 'V_m' : sources[0];
          this._animationControllerService.frames.sampleRate = 1;
          this._animationControllerService.frames.windowSize = 1;
          this._animationControllerService.trail.length = 0;
        }
        if (sources.length == 1) {
          this._animationControllerService.sources = [];
        } else {
          sources.sort();
          this._animationControllerService.sources = sources.map(source => { return { value: source, label: source}});
        }
      }
    }
  }

  onlyUnique(values: any[], index: number, self): boolean {
    return self.indexOf(values) === index;
  }

  selectVisualizationModus(mode: string): void {
    // if (this._visualizationService.mode == mode) {
    //   this._simulationControllerService.mode = mode
    // } else {
    //   if (this._simulationControllerService.mode == 'chart') {
    //     this._simulationControllerService.mode = 'animation';
    //   } else if (this._simulationControllerService.mode == 'animation') {
    //     this._simulationControllerService.mode = 'chart';
    //   }
    // }
    this._simulationControllerService.mode = mode
    this._visualizationService.mode = mode;
    this._visualizationService.update.emit()
  }

  isSelected(mode: string): boolean {
    return this._simulationControllerService.mode == mode;
  }

}
