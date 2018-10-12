import { Component, OnInit } from '@angular/core';

import { DataService } from '../shared/services/data/data.service';
import { SketchService } from '../shared/services/sketch/sketch.service'


@Component({
  selector: 'app-network-details',
  templateUrl: './network-details.component.html',
  styleUrls: ['./network-details.component.css']
})
export class NetworkDetailsComponent implements OnInit {

  constructor(
    public _dataService: DataService,
    public _sketchService: SketchService,
  ) { }

  ngOnInit() {
  }
}
