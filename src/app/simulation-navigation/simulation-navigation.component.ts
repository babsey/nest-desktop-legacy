import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from '../services/data/data.service';
import { NavigationService } from '../navigation/navigation.service';
import { NetworkSketchService } from '../network/network-sketch/network-sketch.service';
import { SimulationProtocolService } from '../simulation/services/simulation-protocol.service';
import { SimulationRunService } from '../simulation/services/simulation-run.service';
import { SimulationService } from '../simulation/services/simulation.service';

import { Data } from '../classes/data';


@Component({
  selector: 'app-simulation-navigation',
  templateUrl: './simulation-navigation.component.html',
  styleUrls: ['./simulation-navigation.component.scss']
})
export class SimulationNavigationComponent implements OnInit, OnDestroy {
  @ViewChild('file', { static: false }) file;
  private subscription: any;
  public filteredSimulations: Data[];
  public searchTerm: string = '';
  public selectionList: boolean = false;
  public simulations: Data[];
  public id: string;
  public fileReader = new FileReader();

  constructor(
    private _networkSketchService: NetworkSketchService,
    private _simulationProtocolService: SimulationProtocolService,
    private _simulationRunService: SimulationRunService,
    private router: Router,
    public _dataService: DataService,
    public _navigationService: NavigationService,
    public _simulationService: SimulationService,
  ) {
    this.fileReader.addEventListener("load", e => {
      var result = JSON.parse(e['target']['result']);
      var protocols = result.hasOwnProperty("_id") ? [result] : result;
      this._simulationProtocolService.upload(protocols);
    });
  }

  ngOnInit() {
    this.update()
    this.subscription = this._simulationProtocolService.change.subscribe(() => this.update())
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  update(): void {
    this._simulationService.list().then(simulations => {
      if (simulations != undefined && simulations.length != 0) {
        simulations.map(simulation => simulation.source = 'simulation')
        this.simulations = simulations;
      }
      this._simulationProtocolService.list().then(protocols => {
        if (protocols != undefined && protocols.length != 0) {
          protocols.map(protocol => protocol.source = 'protocol')
          this.simulations = this.simulations.concat(protocols);
        }
        this.simulations = this.simulations.sort(this.sortByDate('updatedAt'));
        this.filter();
      })
    })
  }

  sortByDate(key: string): any {
    return (a: any, b: any) => {
      var dateB: any = new Date(b[key]);
      var dateA: any = new Date(a[key]);
      return dateB - dateA;
    }
  }

  search(query: string): void {
    this.searchTerm = query;
    this.filter();
  }

  filter(): void {
    // https://stackblitz.com/edit/angular-material-mat-select-filter
    this.filteredSimulations = this.simulations;
    if (this.searchTerm) {
      let result: Data[] = [];
      for (let simulation of this.simulations) {
        if (simulation.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) {
          result.push(simulation)
        }
      }
      this.filteredSimulations = result;
    }
  }

  downloadProtocols(protocols: Data[]): void {
    this._simulationProtocolService.download(protocols);
  }

  downloadAllProtocols(): void {
    var protocols = this.filteredSimulations.filter(simulation => simulation['source'] == 'protocol');
    this.downloadProtocols(protocols);
  }

  openUploadDialog(): void {
    this.file.nativeElement.click();
  }

  clearProtocols(): void {
    this._simulationProtocolService.db.destroy().then(response => {
      this._simulationProtocolService.init()
      this.update()
    }).catch((err) => {
      console.log(err)
    });
  }

  navigate(id: string): void {
    this.id = id;
    var url = 'simulation/' + id;
    this.router.navigate([{ outlets: { primary: url } }])
  }

  deleteProtocols(protocols: string[]): void {
    this._simulationProtocolService.deleteBulk(protocols)
      .then(() => {
        setTimeout(() => {
          this.update()
          this.selectionList = false;
        }, 100)
      });
  }

  newNetwork(): void {
    this.selectionList = false;
    this._simulationService.mode = 'edit';
    this.router.navigate([{ outlets: { primary: 'simulation' } }])
  }

  edit(): void {
    this.selectionList = false;
    this._simulationService.mode = 'edit';
    // var url = 'network/' + this._dataService['data']._id;
    // this.router.navigate([{ outlets: { primary: url } }])
  }

  details(): void {
    this.selectionList = false;
    this._simulationService.mode = 'details';
  }

  run(): void {
    this.selectionList = false;
    this._simulationService.mode = 'run';
  }

  onSelect(event: any): void {
    switch (event.mode) {
      case 'delete':
        this.deleteProtocols(event.selected);
        break;
      case 'download':
        var protocols = this.simulations.filter(simulation => event.selected.indexOf(simulation._id) != -1)
        this.downloadProtocols(protocols);
        this.selectionList = false;
        break;
      case 'navigate':
        this.navigate(event.id)
      default:
        this.selectionList = false;
    }
  }

  onFileAdded(): void {
    this.fileReader.readAsText(this.file.nativeElement.files[0]);
  }

}
