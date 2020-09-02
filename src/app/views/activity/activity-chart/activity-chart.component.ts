import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';

import { ActivityChartGraph } from '../../../components/activity/Plotly/activityChartGraph';
import { Project } from '../../../components/project/project';

import { ActivityChartService } from '../../../services/activity/activity-chart.service';


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
    private _activityChartService: ActivityChartService,
  ) { }

  ngOnInit() {
    // console.log('Ng Init activity chart view')
    this._subscriptionInit = this._activityChartService.init.subscribe((project: Project) => this.init(project));
    this._subscriptionUpdate = this._activityChartService.update.subscribe(() => this.update());
    this.init(this.project);
  }

  ngOnDestroy() {
    // console.log('Ng destroy activity chart view');
    this._subscriptionInit.unsubscribe();
    this._subscriptionUpdate.unsubscribe();
  }

  private get plot(): HTMLCanvasElement {
    return this.plotRef['plotEl'].nativeElement;
  }

  get graph(): ActivityChartGraph {
    return this._activityChartService.graph;
  }

  init(project: Project): void {
    // console.log('Init activity chart view for ' + project.name);
    this._activityChartService.graph = new ActivityChartGraph(project);
  }

  update(): void {
    // console.log('Update activity chart view for ' + this.project.name);
    this._activityChartService.graph.update();
    // this.activities.map(activity => {
    //   var recordables = Object.keys(activity.events).filter(d => !['times', 'senders'].includes(d));
    //   if (activity.hasSpikeData() && recordables.length === 0) {
    //     this.plotSpikeData(activity)
    //   } else {
    //     recordables.map(recordFrom => this.plotAnalogData(activity, recordFrom))
    //   }
    // })

    // var panel = this._activityChartService.panel['spike'];
    // var yaxis = 'yaxis' + (panel.yaxis === 1 ? '' : panel.yaxis);
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
    // var histograms = this.graph.data.filter(d => d.type === 'histogram' && d.source === 'x');
    // histograms.forEach(h => {
    //   var x = this.activities[h.idx].events.times;
    //   var points = event.points.filter(p => p.data.idx === h.idx);
    //   h.x = points.map(p => x[p.pointIndex]);
    // })
  }

}
