import { Component, OnInit } from '@angular/core';

import { DataService } from '../shared/services/data/data.service';
import { ConfigService } from '../shared/services/config/config.service';


@Component({
  selector: 'app-kernel-controller',
  templateUrl: './kernel-controller.component.html',
  styleUrls: ['./kernel-controller.component.css']
})
export class KernelControllerComponent implements OnInit {
  public options: any;

  constructor(
    public _dataService: DataService,
    public _configService: ConfigService,
  ) {
  }

  ngOnInit() {
  }

}
