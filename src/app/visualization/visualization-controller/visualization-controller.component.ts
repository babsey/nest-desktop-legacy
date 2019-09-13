import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { VisualizationControllerService } from './visualization-controller.service';
import { RecordsVisualizationService } from '../records-visualization/records-visualization.service';

import { Data } from '../../classes/data';


@Component({
  selector: 'app-visualization-controller',
  templateUrl: './visualization-controller.component.html',
  styleUrls: ['./visualization-controller.component.scss']
})
export class VisualizationControllerComponent implements OnInit, OnChanges {
  @Input() data: Data;
  @Input() records: any[];
  public animation: boolean = false;
  public methods: string[] = ['chart', 'animation'];

  constructor(
    public _visualizationControllerService: VisualizationControllerService,
    public _recordsVisualizationService: RecordsVisualizationService,
  ) { }

  ngOnInit() {
    this._recordsVisualizationService.method = this.methods[this._visualizationControllerService.selectedIdx];
  }

  ngOnChanges() {
    if (this.data == undefined) {
      this._visualizationControllerService.selectedIdx = 0;
      this.animation = false;
      return
    }
    this.records.forEach(record => {
      var connectomes = this.data.simulation.connectomes.filter(connectome => connectome.post == record.recorder.idx);
      var nodes = connectomes.map(connectome => this.data.app.nodes[connectome.pre]);
      nodes = nodes.filter(node => node.hasOwnProperty('positions'));
      this.animation = nodes.length > 0;
    })
    if (!this.animation) {
      this._visualizationControllerService.selectedIdx = 0;
    }
  }

  onAnimationDone() {
    this._recordsVisualizationService.method = this.methods[this._visualizationControllerService.selectedIdx];
    this._recordsVisualizationService.init.emit();
  }

}
