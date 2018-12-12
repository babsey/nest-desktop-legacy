import {
  Component,
  OnInit,
  Input,
} from '@angular/core';

import { ChartService } from './chart.service';
import { DataService } from '../services/data/data.service';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  constructor(
    public _chartService: ChartService,
    public _dataService: DataService,
  ) {
  }

  ngOnInit() {
  }

}
