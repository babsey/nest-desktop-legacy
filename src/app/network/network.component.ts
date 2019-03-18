import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataService } from '../services/data/data.service';
import { NetworkProtocolService } from './network-protocol/network-protocol.service';
import { NetworkService } from './network.service';


@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {
  public mode: string = 'details';

  constructor(
    private _networkProtocolService: NetworkProtocolService,
    public _dataService: DataService,
    public _networkService: NetworkService,
    public route: ActivatedRoute,
    public router: Router,
  ) { }

  ngOnInit() {
    if (this.router.url.includes('simulate')) {
      this.mode = 'simulation';
    }
    let paramMap = this.route.snapshot.paramMap;
    let id = paramMap.get('id');
    if (id) {
      this._networkService.load(id)
    }
  }

}
