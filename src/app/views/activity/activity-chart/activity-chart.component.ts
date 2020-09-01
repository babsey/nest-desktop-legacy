import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';

import { ActivityChartGraph } from '../../../components/activity/Plotly/activityChartGraph';
import { Project } from '../../../components/project/project';

import { ActivityGraphService } from '../../../services/activity/activity-graph.service';


@Component({
  selector: 'app-activity-chart',
  templateUrl: './activity-chart.component.html',
  styleUrls: ['./activity-chart.component.scss']
})
export class ActivityChartComponent implements OnInit, OnDestroy {
  @Input() project: Project;
  @ViewChild('plot', { static: true }) plotRef: ElementRef;
  private _subscriptionUpdate: any;
  private _subscriptionInit: any;

  constructor(
    public activityGraphService: ActivityGraphService,
  ) {
  }

  ngOnInit() {
    console.log('Ng Init activity chart view')
    this._subscriptionInit = this.activityGraphService.init.subscribe(() => this.init());
    this._subscriptionUpdate = this.activityGraphService.update.subscribe(() => this.update());
    this.init();
  }

  ngOnDestroy() {
    console.log('Ng destroy activity chart view');
    this._subscriptionInit.unsubscribe();
    this._subscriptionUpdate.unsubscribe();
  }

  private get plot(): HTMLCanvasElement {
    return this.plotRef['plotEl'].nativeElement;
  }

  init(): void {
    console.log('Init activity chart view');
    this.activityGraphService.graph = new ActivityChartGraph(this.project);
  }

  update(): void {
    console.log('Update activity chart view');
    this.activityGraphService.graph.update();
    // this.activities.map(activity => {
    //   var recordables = Object.keys(activity.recorder.events).filter(d => !['times', 'senders'].includes(d));
    //   if (activity.hasSpikeData() && recordables.length === 0) {
    //     this.plotSpikeData(activity)
    //   } else {
    //     recordables.map(recordFrom => this.plotAnalogData(activity, recordFrom))
    //   }
    // })

    // var panel = this._activityChartService.panel['spike'];
    // var yaxis = 'yaxis' + (panel.yaxis == 1 ? '' : panel.yaxis);
    // if (this.graph.layout.hasOwnProperty(yaxis)) {
    //   if (this.graph.layout[yaxis].hasOwnProperty('range')) {
    //     this.graph.layout[yaxis].range[0] -= 1;
    //     this.graph.layout[yaxis].range[1] += 1;
    //   }
    // }
  }
  onLegendClick(event: MouseEvent): void {
    // setTimeout(() => {
    //   var data = event.data[event.curveNumber];
    //   var activity = this.activities[data._source.activityIdx]
    //   var config = activity.config[data._source.curve];
    //   config['visible'] = data.visible;
    // }, 1000)
  }

  onLegendDoubleClick(event: MouseEvent): void {
    // console.log(event)
  }

  onSelect(event: any): void {
    // var histograms = this.graph.data.filter(d => d.type == 'histogram' && d.source == 'x');
    // histograms.forEach(h => {
    //   var x = this.activities[h.idx].recorder.events.times;
    //   var points = event.points.filter(p => p.data.idx == h.idx);
    //   h.x = points.map(p => x[p.pointIndex]);
    // })
  }

}
