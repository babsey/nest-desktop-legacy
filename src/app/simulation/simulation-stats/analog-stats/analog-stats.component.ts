import { Component, OnInit, OnChanges, Input, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ColorService } from '../../../network/services/color.service';

import * as d3 from 'd3';

export interface AnalogStatsElement {
  neuron: number;
  avg: number;
}

@Component({
  selector: 'app-analog-stats',
  templateUrl: './analog-stats.component.html',
  styleUrls: ['./analog-stats.component.scss']
})
export class AnalogStatsComponent implements OnInit, OnChanges {
  @Input() records: any[] = [];
  @Input() idx: number;
  @Input() recordFrom: string[] = [];
  @Input() selectedRecord: string;
  public displayedColumns: string[] = ['id', 'mean', 'std'];
  public dataSource: MatTableDataSource<any>;
  public node: any;

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
    if (this.selectedRecord == undefined) return

    var record = this.records[this.idx];
    this.node = record.recorder;
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
        mean: d.length > 0 ? d3.mean(d) : 0,
        std: d.length > 0 ? d3.deviation(d) : 0,
      }
    })
    this.dataSource = new MatTableDataSource(stats);
    this.dataSource.sort = this.sort;
  }

  height() {
    return window.innerHeight - 72;
  }

  mean(element) {
    if (this.dataSource == undefined) return 0

    var data = this.dataSource.filteredData;
    return data.map(t => t[element]).reduce((acc, value) => acc + value, 0) / data.length;
  }

}
