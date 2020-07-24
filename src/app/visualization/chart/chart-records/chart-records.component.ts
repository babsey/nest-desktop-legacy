import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';

import { ChartRecordsService } from './chart-records.service';

import { AppService } from '../../../app.service';
import { LogService } from '../../../log/log.service';
import { MathService } from '../../../services/math/math.service';
import { VisualizationService } from '../../visualization.service';

import { Activity } from '../../../components/activity';
import { ActivityGraph } from '../../../components/Plotly/activityGraph';


@Component({
  selector: 'app-chart-records',
  templateUrl: './chart-records.component.html',
  styleUrls: ['./chart-records.component.scss']
})
export class ChartRecordsComponent implements OnInit, OnDestroy {
  @Input() layout: any = {};
  @Input() kernel: any = {};
  @ViewChild('plot', { static: true }) plotRef: ElementRef;
  // public graph: any = {
  //   data: [],
  //   layout: {
  //     title: 'No data found'
  //   },
  //   style: {
  //     position: 'relative',
  //     width: '100%',
  //     height: 'calc(100vh - 40px)',
  //   },
  //   config: {}
  // }
  public graph: ActivityGraph;
  private threshold: any = 'legendonly';
  private subscriptionUpdate: any;
  private subscriptionInit: any;
  public sizes: number[] = [80, 20];

  constructor(
    private _appService: AppService,
    private _logService: LogService,
    private _mathService: MathService,
    public _chartRecordsService: ChartRecordsService,
    public _visualizationService: VisualizationService,
  ) {
  }

  ngOnInit() {
    this.subscriptionInit = this._visualizationService.init.subscribe(() => this.init())
    this.subscriptionUpdate = this._visualizationService.update.subscribe(() => this.update())
    this.init()
  }

  ngOnDestroy() {
    this.plot.parentNode.removeChild(this.plot);
    this.subscriptionInit.unsubscribe()
    this.subscriptionUpdate.unsubscribe()
  }

  private get plot(): HTMLCanvasElement {
    return this.plotRef['plotEl'].nativeElement;
  }

  init(): void {
    this.graph = new ActivityGraph(this._appService.data.project);
    this.graph.update();
  }

  update(): void {
    // console.log('Update activity graph')
    this._logService.log('Update activity graph');
    this.graph.update();
    // this.activities.map(activity => {
    //   var recordables = Object.keys(activity.recorder.events).filter(d => !['times', 'senders'].includes(d));
    //   if (activity.hasSpikeData() && recordables.length === 0) {
    //     this.plotSpikeData(activity)
    //   } else {
    //     recordables.map(recordFrom => this.plotAnalogData(activity, recordFrom))
    //   }
    // })

    // var panel = this._chartRecordsService.panel['spike'];
    // var yaxis = 'yaxis' + (panel.yaxis == 1 ? '' : panel.yaxis);
    // if (this.graph.layout.hasOwnProperty(yaxis)) {
    //   if (this.graph.layout[yaxis].hasOwnProperty('range')) {
    //     this.graph.layout[yaxis].range[0] -= 1;
    //     this.graph.layout[yaxis].range[1] += 1;
    //   }
    // }
  }

  updateLayout(): void {
    var sizes = this._chartRecordsService.panelOrder
      .filter(pp => this._chartRecordsService.panelSelected.includes(pp))
      .map(p => (this._chartRecordsService.panel[p].size / 100));
    sizes.reverse()
    const cumulativeSum = (sum => value => sum += value)(0);
    var sizesCumSum = sizes.map(cumulativeSum);
    var domains = sizesCumSum.map((s, i) => {
      var start = (i == 0) ? 0 : (sizesCumSum[i - 1] + 0.02);
      var end = (i == sizesCumSum.length - 1) ? 1 : (s - 0.02);
      return [start, end]
    })
    domains.reverse()

    this._chartRecordsService.panelOrder
      .filter(pp => this._chartRecordsService.panelSelected.includes(pp))
      .map((p, i) => {
        var panel = this._chartRecordsService.panel[p];
        var domain = domains[i];
        var yaxis = 'yaxis' + (panel.yaxis == 1 ? '' : panel.yaxis);
        this.graph.layout[yaxis] = {
          title: panel.ylabel,
          domain: domain,
          // zeroline: this._chartRecordsService.panelSelected.length == 1 || panel.yaxis == 1,
        }
      })

    if (this._chartRecordsService.panelSelected.includes('histogram')) {
      this.graph.layout['barmode'] = this._chartRecordsService['barmode'];
      this.graph.layout['barnorm'] = this._chartRecordsService['barnorm'];
    }
  }

  onLegendClick(event: any): void {
    // setTimeout(() => {
    //   var data = event.data[event.curveNumber];
    //   var activity = this.activities[data._source.activityIdx]
    //   var config = activity.config[data._source.curve];
    //   config['visible'] = data.visible;
    // }, 1000)
  }

  onLegendDoubleClick(event: any): void {
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
