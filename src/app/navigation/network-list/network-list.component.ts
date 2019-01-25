import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MdePopoverTrigger } from '@material-extended/mde';

import { ControllerService } from '../../controller/controller.service';
import { DataService } from '../../services/data/data.service';
import { NavigationService } from '../navigation.service';
import { NetworkService } from '../../services/network/network.service';
import { SimulationService } from '../../simulation/simulation.service';
import { SketchService } from '../../sketch/sketch.service';


@Component({
  selector: 'app-network-list',
  templateUrl: './network-list.component.html',
  styleUrls: ['./network-list.component.css']
})
export class NetworkListComponent implements OnInit {
  public filteredNetworks: any = [];
  public network: any = {};
  public networks: any = [];


  constructor(
    private _networkService: NetworkService,
    private _simulationService: SimulationService,
    private _sketchService: SketchService,
    public _controllerService: ControllerService,
    public _dataService: DataService,
    public _navigationService: NavigationService,
  ) { }

  ngOnInit() {
    this._networkService.list(this)
  }

  search(query: string) {
    this._networkService.searchTerm = query;
    this._networkService.filter(this);
  }

  clearNetworks() {
    this._networkService.db.destroy().then((response) => {
      // window.location.reload()
      this._networkService.init()
    }).catch((err) => {
      console.log(err)
    });
  }

  loadNetwork(id) {
    this._sketchService.resetMouseVars()
    this._navigationService.options.source = 'network';
    this._networkService.load(id).then(() => {
      this._sketchService.update.emit()
      if (this._navigationService.url().endsWith('simulate')) {
        this._navigationService.routerLink('simulate')
        this._simulationService.run()
      } else {
        this._navigationService.routerLink('view')
      }
    })
  }

  isLoaded(network) {
    return network._id == this._dataService.data._id;
  }

  view(network) {
    this.network = network;
  }

  openPopover(ref: MdePopoverTrigger) {
    if (this._navigationService.url().endsWith('view')) return
    ref.openPopover();
  }
}
