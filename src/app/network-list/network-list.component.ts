import { Component, OnInit } from '@angular/core';

import { ControllerService } from '../shared/services/controller/controller.service';
import { DataService } from '../shared/services/data/data.service';
import { SketchService } from '../shared/services/sketch/sketch.service';
import { NetworkService } from '../shared/services/network/network.service';


import {
  faPlus,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-network-list',
  templateUrl: './network-list.component.html',
  styleUrls: ['./network-list.component.css']
})
export class NetworkListComponent implements OnInit {
  public networks: any = [];
  public filteredNetworks: any = [];

  public faPlus = faPlus;
  public faSearch = faSearch;


  constructor(
    private _controllerService: ControllerService,
    private _dataService: DataService,
    public _sketchService: SketchService,
    private _networkService: NetworkService,
  ) { }


  ngOnInit() {
    this._networkService.list(this)
  }

  loadNetwork(id) {
    this._sketchService.resetMouseVars()
    this._networkService.load(this._dataService, id).then(() => {
      this._sketchService.update.emit()
      this._controllerService.update.emit()
      this._dataService.ready = true;
    })

  }

  search(query: string) {
    this._networkService.searchTerm = query;
    this._networkService.filter(this);
  }


  clearNetworks() {
    this._networkService.db.destroy().then((response) => {
      window.location.reload()
    }).catch((err) => {
      console.log(err)
    });
  }

  isLoaded(network) {
    return network.doc._id == this._dataService.data._id;
  }
}
