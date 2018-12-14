import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MdePopoverTrigger } from '@material-extended/mde';

import { ControllerService } from '../../controller/controller.service';
import { DataService } from '../../services/data/data.service';
import { NavigationService } from '../navigation.service';
import { ProtocolService } from '../../services/protocol/protocol.service';
import { SimulationService } from '../../simulation/simulation.service';
import { SketchService } from '../../sketch/sketch.service';


import {
  faEllipsisV,
  faInfoCircle,
  faPlus,
  faSearch,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-protocol-list',
  templateUrl: './protocol-list.component.html',
  styleUrls: ['./protocol-list.component.css']
})
export class ProtocolListComponent implements OnInit, OnDestroy {
  @Input() options: any;
  private subscription: any;
  public filteredProtocols: any = [];
  public protocol: any = {};
  public protocols: any = [];

  public faEllipsisV = faEllipsisV;
  public faInfoCircle = faInfoCircle;
  public faPlus = faPlus;
  public faSearch = faSearch;
  public faTrashAlt = faTrashAlt;


  constructor(
    private _controllerService: ControllerService,
    private _dataService: DataService,
    private _protocolService: ProtocolService,
    private _simulationService: SimulationService,
    public _navigationService: NavigationService,
    public _sketchService: SketchService,
  ) { }


  ngOnInit() {
    this.options = Object.assign({
      menuProtocols: true,
      menuProtocol: true,
      addProtocol: true,
    }, this.options)
    this._protocolService.list(this)
    this.subscription = this._protocolService.change.subscribe(() => this._protocolService.list(this))
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  search(query: string) {
    this._protocolService.searchTerm = query;
    this._protocolService.filter(this);
  }

  clearProtocols() {
    this._protocolService.db.destroy().then((response) => {
      this._protocolService.init()
      this._protocolService.change.emit()
    }).catch((err) => {
      console.log(err)
    });
  }

  saveProtocol() {
    this._protocolService.save(this._dataService.data)
      .then(() => {
        setTimeout(() => this._protocolService.change.emit(), 100)
      });
  }

  deleteProtocol(id) {
    this._protocolService.delete(id)
      .then(() => {
        setTimeout(() => this._protocolService.change.emit(), 100)
      });
  }

  loadProtocol(id) {
    this._sketchService.resetMouseVars()
    this._navigationService.options.source = 'protocol';
    this._protocolService.load(id).then(() => {
      this._sketchService.update.emit()
      if (this._navigationService.isPage('simulate')) {
        this._navigationService.routerLink('simulate')
        this._simulationService.run()
      } else {
        this._navigationService.routerLink('view')
      }
    })
  }

  isLoaded(protocol) {
    return protocol._id == this._dataService.data._id;
  }

  view(protocol) {
    this.protocol = protocol;
  }

  openPopover(ref: MdePopoverTrigger) {
    if (this._navigationService.isPage('view')) return
    ref.openPopover();
  }
}
