import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';

import { ActivityChartGraph } from '../../../components/activity/activityChartGraph';
import { Project } from '../../../components/project/project';

import { ActivityChartService } from '../../../services/activity/activity-chart.service';
import { ActivityStatsService } from '../../../services/activity/activity-stats.service';


@Component({
  selector: 'app-activity-chart',
  templateUrl: './activity-chart.component.html',
  styleUrls: ['./activity-chart.component.scss']
})
export class ActivityChartComponent implements OnInit, OnDestroy {
  @Input() project: Project;
  @ViewChild('plot', { static: true }) plotRef: ElementRef;
  private _config: any;
  private _style: any;
  private _subscriptionInit: any;
  private _subscriptionUpdate: any;

  constructor(
    private _activityChartService: ActivityChartService,
    private _activityStatsService: ActivityStatsService,
  ) { }

  ngOnInit() {
    // console.log('Ng Init activity chart view for', this.project.id)
    this._subscriptionInit = this._activityChartService.init.subscribe(() => this.init());
    this._subscriptionUpdate = this._activityChartService.update.subscribe(() => this.update());
    // this.init(this.project);
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
    return this.project.activityChartGraph;
  }

  init(): void {
    // console.log('Init activity chart view for ', project.id, this.project.id);
    this._activityStatsService.reset();
    this.graph.init();
  }

  update(): void {
    // console.log('Update activity chart view for', this.project.name);
    this.graph.update();
  }

}
