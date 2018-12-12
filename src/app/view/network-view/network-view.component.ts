import { Component, OnInit } from '@angular/core';

import { NavigationService } from '../../navigation/navigation.service';
import { DataService } from '../../services/data/data.service';


@Component({
  selector: 'app-network-view',
  templateUrl: './network-view.component.html',
  styleUrls: ['./network-view.component.css']
})
export class NetworkViewComponent implements OnInit {

  constructor(
    public _dataService: DataService,
    public _navigationService: NavigationService,
  ) { }

  ngOnInit() {
  }
}
