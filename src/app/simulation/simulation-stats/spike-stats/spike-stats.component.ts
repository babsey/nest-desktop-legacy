import { Component, OnInit, OnChanges, Input, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { MathService } from '../../../services/math/math.service';

import { Record } from '../../../classes/record';


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
  @Input() records: Record[] = [];
  @Input() idx: number;
  @Input() color: string;
  private stats: SpikeStatsElement[];
  private times: any;

  public displayedColumns: string[] = ['id', 'count', 'isi_mean', 'isi_std', 'cv_isi'];
  public dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private _mathService: MathService,
  ) { }

  ngOnInit(): void {
    this.update()
  }

  ngOnChanges(): void {
    this.update()
  }

  update(): void {
    var record = this.records[this.idx];
    this.times = Object.create(null);
    record.global_ids.forEach(id => this.times[id] = [])
    record.events.senders.forEach((sender, idx) => {
      this.times[sender].push(record.events.times[idx]);
    });
    this.stats = record.global_ids.map(id => {
      var isi = this.isi(this.times[id]);
      var isi_mean = isi.length > 1 ? this._mathService.mean(isi) : 0;
      var isi_std = isi.length > 1 ? this._mathService.deviation(isi) : 0;
      return {
        id: id,
        count: this.times[id].length,
        isi_mean: isi_mean,
        isi_std: isi_std,
        cv_isi: isi_mean > 0 ? isi_std / isi_mean : 0,
      }
    })
    this.dataSource = new MatTableDataSource(this.stats);
    this.dataSource.sort = this.sort;
  }

  height(): number {
    return window.innerHeight - 72;
  }

  isi(times: number[]): number[] {
    if (times.length <= 1) return [0];
    times.sort((a, b) => a - b)
    var values = [];
    for (var ii = 0; ii < times.length - 1; ii++) {
      values.push(times[ii + 1] - times[ii])
    }
    return values;
  }

  sum(element: string): number {
    var data = this.dataSource.filteredData;
    return data.map(t => t[element]).reduce((acc, value) => acc + value, 0);
  }

  mean(element: string): number {
    var data = this.dataSource.filteredData;
    return data.map(t => t[element]).reduce((acc, value) => acc + value, 0) / data.length;
  }

  onCellClicked(element): void {
    console.log(this.times[element.id])
  }

  onRowHover(row): void {
    console.log(row)
  }

}
