import { Component, OnInit, OnChanges, Input, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ColorService } from '../../../network/services/color.service';


import * as d3 from 'd3';

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
  @Input() records: any[] = [];
  @Input() idx: number;
  public node: any;

  public displayedColumns: string[] = ['id', 'count', 'isi_mean', 'isi_std', 'cv_isi'];
  public dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public _colorService: ColorService,
  ) { }

  ngOnInit() {
    this.update()
  }

  ngOnChanges() {
    this.update()
  }

  update() {
    var record = this.records[this.idx];
    this.node = record.recorder;
    const times = Object.create(null);
    record.global_ids.forEach(id => times[id] = [])
    record.events.senders.forEach((sender, idx) => {
      times[sender].push(record.events.times[idx]);
    });
    var stats: SpikeStatsElement[] = record.global_ids.map(id => {
      var isi = this.isi(times[id]);
      var isi_mean = isi.length > 0 ? d3.mean(isi) : 0;
      var isi_std = isi.length > 1 ? d3.deviation(isi) : 0;
      return {
        id: id,
        count: times[id].length,
        isi_mean: isi_mean,
        isi_std: isi_std,
        cv_isi: isi_mean > 0 ? isi_std / isi_mean : 0,
      }
    })
    this.dataSource = new MatTableDataSource(stats);
    this.dataSource.sort = this.sort;
  }

  height() {
    return window.innerHeight - 72;
  }

  isi(ts) {
    if (ts.length <= 1) return [0];
    ts.sort((a, b) => a - b)
    var values = [];
    for (var ii = 0; ii < ts.length - 1; ii++) {
      values.push(ts[ii + 1] - ts[ii])
    }
    return values;
  }

  sum(element) {
    var data = this.dataSource.filteredData;
    return data.map(t => t[element]).reduce((acc, value) => acc + value, 0);
  }

  mean(element) {
    var data = this.dataSource.filteredData;
    return data.map(t => t[element]).reduce((acc, value) => acc + value, 0) / data.length;
  }

}
