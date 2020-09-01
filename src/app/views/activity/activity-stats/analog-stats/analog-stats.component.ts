import { Component, OnInit, OnChanges, Input, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Activity } from '../../../../components/activity/activity';

import { MathService } from '../../../../services/math/math.service';


export interface AnalogStatsElement {
  id: number;
  mean: number;
  std: number;
}

@Component({
  selector: 'app-analog-stats',
  templateUrl: './analog-stats.component.html',
  styleUrls: ['./analog-stats.component.scss']
})
export class AnalogStatsComponent implements OnInit, OnChanges {
  @Input() activity: Activity;
  @Input() recordFrom: string[] = [];
  @Input() selectedRecordFrom: string;

  public displayedColumns: string[] = ['id', 'mean', 'std'];
  public dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private _mathService: MathService,
  ) { }

  ngOnInit() {
    this.update()
  }

  ngOnChanges() {
    this.update()
  }

  get color(): string {
    return this.activity.recorder.view.color;
  }

  update(): void {
    if (this.selectedRecordFrom === undefined) return
    const activityData: number[] = this.activity.events[this.selectedRecordFrom];
    const data = Object.create(null);
    this.activity.nodeIds.forEach(id => data[id] = [])
    this.activity.events.senders.forEach((sender, idx) => {
      data[sender].push(activityData[idx]);
    });
    const stats: AnalogStatsElement[] = this.activity.nodeIds.map(id => {
      const d: number[] = data[id];
      return {
        id: id,
        mean: d.length > 0 ? this._mathService.mean(d) : 0,
        std: d.length > 0 ? this._mathService.deviation(d) : 0,
      }
    })
    this.dataSource = new MatTableDataSource(stats);
    this.dataSource.sort = this.sort;
  }

  height(): number {
    return window.innerHeight - 72;
  }

  mean(element: string): number {
    if (this.dataSource === undefined) return 0

    const data: any[] = this.dataSource.filteredData;
    return data.map(t => t[element]).reduce((acc, value) => acc + value, 0) / data.length;
  }

}
