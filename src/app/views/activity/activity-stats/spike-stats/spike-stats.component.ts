import { Component, OnInit, OnChanges, Input, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Activity } from '../../../../components/activity/activity';

import { MathService } from '../../../../services/math/math.service';


export interface SpikeStatsElement {
  id: number;
  count: number;
  isi_mean: number;
  isi_std: number;
  cv_isi: number;
}

@Component({
  selector: 'app-spike-stats',
  templateUrl: './spike-stats.component.html',
  styleUrls: ['./spike-stats.component.scss']
})
export class SpikeStatsComponent implements OnInit, OnChanges {
  @Input() activity: Activity;
  private _stats: SpikeStatsElement[];
  private _times: any;

  public displayedColumns: string[] = ['id', 'count', 'isi_mean', 'isi_std', 'cv_isi'];
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
    this._times = Object.create(null);
    this.activity.nodeIds.forEach(id => this._times[id] = [])
    this.activity.events.senders.forEach((sender, idx) => {
      this._times[sender].push(this.activity.events.times[idx]);
    });
    this._stats = this.activity.nodeIds.map(id => {
      const isi: number[] = this.isi(this._times[id]);
      const isi_mean: number = isi.length > 1 ? this._mathService.mean(isi) : 0;
      const isi_std: number = isi.length > 1 ? this._mathService.deviation(isi) : 0;
      return {
        id: id,
        count: this._times[id].length,
        isi_mean: isi_mean,
        isi_std: isi_std,
        cv_isi: isi_mean > 0 ? isi_std / isi_mean : 0,
      }
    })
    this.dataSource = new MatTableDataSource(this._stats);
    this.dataSource.sort = this.sort;
  }

  height(): number {
    return window.innerHeight - 72;
  }

  isi(times: number[]): number[] {
    if (times.length <= 1) return [0];
    times.sort((a, b) => a - b)
    const values: number[] = [];
    for (let ii = 0; ii < times.length - 1; ii++) {
      values.push(times[ii + 1] - times[ii])
    }
    return values;
  }

  sum(element: string): number {
    const data: any[] = this.dataSource.filteredData;
    return data.map(t => t[element]).reduce((acc, value) => acc + value, 0);
  }

  mean(element: string): number {
    const data: any[] = this.dataSource.filteredData;
    return data.map(t => t[element]).reduce((acc, value) => acc + value, 0) / data.length;
  }

  onRowClick(row): void {
    console.log(this._times[row.id])
  }

}
