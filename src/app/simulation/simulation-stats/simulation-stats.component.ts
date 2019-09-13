import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { ColorService } from '../../network/services/color.service';


import { Data } from '../../classes/data';

@Component({
  selector: 'app-simulation-stats',
  templateUrl: './simulation-stats.component.html',
  styleUrls: ['./simulation-stats.component.scss']
})
export class SimulationStatsComponent implements OnInit {
  @Input() data: Data;
  @Input() records: any[];
  public selectedIdx: number;
  public selectedModel: string;
  public recordFrom: string[] = ['V_m'];
  public selectedRecord: string = 'V_m';

  constructor(
    public _colorService: ColorService,
  ) { }

  ngOnInit() {
  }

  select(record) {
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

  unselect() {
    this.selectedIdx = undefined;
    this.selectedModel = undefined;
    this.recordFrom = ['V_m'];
    this.selectedRecord = 'V_m';
  }

}
