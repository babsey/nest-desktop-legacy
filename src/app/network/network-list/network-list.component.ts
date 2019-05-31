import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MdePopoverTrigger } from '@material-extended/mde';

import { AppConfigService } from '../../config/app-config/app-config.service';
import { ControllerService } from '../../controller/controller.service';
import { DataService } from '../../services/data/data.service';
import { NavigationService } from '../../navigation/navigation.service';
import { NetworkProtocolService } from '../network-protocol/network-protocol.service';
import { NetworkService } from '../network.service';
import { NetworkSimulationService } from '../../network/network-simulation/network-simulation.service';
import { SketchService } from '../../sketch/sketch.service';


@Component({
  selector: 'app-network-list',
  templateUrl: './network-list.component.html',
  styleUrls: ['./network-list.component.css']
})
export class NetworkListComponent implements OnInit, OnDestroy {
  private subscription: any;
  public deleteProtocols: any[] = [];
  public filteredNetworks: any[] = [];
  public network: any = {};
  public networks: any[] = [];
  public searchTerm: string = '';
  public selectionList: boolean = false;

  constructor(
    private _networkProtocolService: NetworkProtocolService,
    private _networkSimulationService: NetworkSimulationService,
    public _appConfigService: AppConfigService,
    public _controllerService: ControllerService,
    public _dataService: DataService,
    public _navigationService: NavigationService,
    public _networkService: NetworkService,
    public _sketchService: SketchService,
    public router: Router,
    private location: Location,
  ) { }

  ngOnInit() {
    this._dataService.initData()
    this.list()
    this.subscription = this._networkProtocolService.change.subscribe(() => {
      this.list()
      var url = this.router.url.split('/');
      url[2] = this._dataService.data._id;
      this.location.go(url.join('/'))
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  list() {
    this._networkService.list().then(networks => {
      if (networks != undefined && networks.length != 0) {
        networks.map(network => network.source = 'network')
        this.networks = networks;
      }
      this._networkProtocolService.list().then(protocols => {
        if (protocols != undefined && protocols.length != 0) {
          protocols.map(protocol => protocol.source = 'protocol')
          this.networks = this.networks.concat(protocols);
        }
        this.networks = this.networks.sort(this._dataService.sortByDate('updatedAt'));
        this.filter();
      })
    })
  }

  search(query: string) {
    this.searchTerm = query;
    this.filter();
  }

  filter() {
    // https://stackblitz.com/edit/angular-material-mat-select-filter
    this.filteredNetworks = this.networks;
    if (this.searchTerm) {
      let result: string[] = [];
      for (let network of this.networks) {
        if (network.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) {
          result.push(network)
        }
      }
      this.filteredNetworks = result;
    }
  }

  clearNetworks() {
    this._networkService.db.destroy().then(() => {
      this._networkService.init()
    })
  }

  clearNetwork() {
    this.router.navigate([{ outlets: { primary: 'network/simulate' } }])
    this._dataService.initData()
  }

  navigate(network) {
    this.router.navigate([{ outlets: { primary: 'network/' + network._id + this.router.url.includes('simulate') ? '/simulate' : '' } }])
  }

  load(network) {
    if (this._dataService.data._id == network._id) return
    var url = 'network/' + network._id + (this.router.url.includes('simulate') ? '/simulate' : '');
    this.router.navigate([{ outlets: { primary: url } }])
    this._sketchService.resetMouseVars()
    this._sketchService.draw(false);
    this._dataService['undoStack'] = [];
    this._dataService['redoStack'] = [];
    this._dataService['records'] = [];
    this._dataService['data'] = this._dataService.clean(network);
    this._dataService.options.ready = true;
    this._sketchService.update.emit()
    if (this.router.url.includes('simulate')) {
      this._networkSimulationService.run(true)
    }
  }

  isLoaded(id) {
    return id == this._dataService.data._id;
  }

  shortLabel(label) {
    return label.slice(0, 5)
  }

  view(network, ref: MdePopoverTrigger) {
    if (this.router.url.includes('simulate')) {
      this.network = this._dataService.clean(network);
      ref.openPopover();
    } else {
      ref.closePopover()
    }
  }

  clearProtocols() {
    this._networkProtocolService.db.destroy().then(response => {
      this._networkProtocolService.init()
      this.list()
    }).catch((err) => {
      console.log(err)
    });
  }

  deleteSelected() {
    this._networkProtocolService.deleteBulk(this.deleteProtocols)
      .then(() => {
        setTimeout(() => {
          this.selectionList = false;
          this.deleteProtocols = []
          this.list()
        }, 100)
      });
  }

  deleteProtocol(id) {
    this._networkProtocolService.delete(id)
      .then(() => {
        setTimeout(() => this.list(), 100)
      });
  }

  details() {
    this.router.navigate([{ outlets: { primary: 'network/' + this._dataService.data._id } }])
  }

  simulate() {
    this.router.navigate([{ outlets: { primary: 'network/' + this._dataService.data._id + '/simulate' } }])
  }
}
