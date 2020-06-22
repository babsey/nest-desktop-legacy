import { Component, OnInit, Input } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { ColorService } from '../../network/services/color.service';

import { Data } from '../../classes/data';
import { AppNode } from '../../classes/appNode';
import { Record } from '../../classes/record';


@Component({
  selector: 'app-simulation-stats',
  templateUrl: './simulation-stats.component.html',
  styleUrls: ['./simulation-stats.component.scss']
})
export class SimulationStatsComponent implements OnInit {
  @Input() data: Data;
  @Input() records: Record[];
  public selectedIdx: number;
  public selectedModel: string;
  public recordFrom: string[] = ['V_m'];
  public selectedRecord: string = 'V_m';

  constructor(
    private _colorService: ColorService,
  ) { }

  ngOnInit(): void {
  }

  node(idx: number): AppNode {
    return this.data.app.nodes[idx];
  }

  color(idx: number): string {
    return this._colorService.node(idx);
  }

  colorSelected(): string {
    if (this.selectedIdx == undefined) return 'black'
    var record = this.records[this.selectedIdx];
    return this.color(record.recorder.idx);
  }

  select(record: Record): void {
    this.selectedIdx = record.idx;
    this.selectedModel = record.recorder.model;
    if (this.selectedModel == 'multimeter') {
      var collection = this.data.simulation.collections[record.recorder.idx];
      var model = this.data.simulation.models[collection.model];
      if (model['params'].hasOwnProperty('record_from')) {
        this.recordFrom = model['params'].record_from;
        if (this.recordFrom.indexOf('V_m') == -1) {
          this.selectedRecord = this.recordFrom[0];
        }
      }
    }
  }

  unselect(): void {
    this.selectedIdx = undefined;
    this.selectedModel = undefined;
    this.recordFrom = ['V_m'];
    this.selectedRecord = 'V_m';
  }

}
