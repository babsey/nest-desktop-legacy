import { Component, OnInit, OnChanges, Input, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { MathService } from '../../../services/math/math.service';

import { Record } from '../../../classes/record';


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
  @Input() records: Record[] = [];
  @Input() idx: number;
  @Input() recordFrom: string[] = [];
  @Input() selectedRecord: string;
  @Input() color: string;

  public displayedColumns: string[] = ['id', 'mean', 'std'];
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
    if (this.selectedRecord == undefined) return

    var record = this.records[this.idx];
    var recordData = record.events[this.selectedRecord];
    const data = Object.create(null);
    record.global_ids.forEach(id => data[id] = [])
    record.events.senders.forEach((sender, idx) => {
      data[sender].push(recordData[idx]);
    });
    var stats: AnalogStatsElement[] = record.global_ids.map(id => {
      var d = data[id];
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
    if (this.dataSource == undefined) return 0

    var data = this.dataSource.filteredData;
    return data.map(t => t[element]).reduce((acc, value) => acc + value, 0) / data.length;
  }

}
