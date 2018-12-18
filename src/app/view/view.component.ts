import { Component, OnInit } from '@angular/core';

import { DataService } from '../services/data/data.service';
import { NavigationService } from '../navigation/navigation.service';
import { NetworkService } from '../services/network/network.service';
import { ProtocolService } from '../services/protocol/protocol.service';


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  constructor(
    public _dataService: DataService,
    private _navigationService: NavigationService,
    private _networkService: NetworkService,
    private _protocolService: ProtocolService,
  ) {
   }

  ngOnInit() {
    let paramMap = this._navigationService.route.snapshot.paramMap;
    let id = paramMap.get('id');
    let source = paramMap.get('source');
    if (id && source) {
      this._navigationService.options.source = source;
      let service = source == 'protocol' ? this._protocolService : this._networkService;
      service.load(id)
    }
  }

}
