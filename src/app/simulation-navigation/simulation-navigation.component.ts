import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';

import { NavigationService } from '../navigation/navigation.service';
import { NetworkSketchService } from '../network/network-sketch/network-sketch.service';
import { SimulationProtocolService } from '../simulation/services/simulation-protocol.service';
import { SimulationRunService } from '../simulation/services/simulation-run.service';
import { SimulationService } from '../simulation/services/simulation.service';

import { Data } from '../classes/data';

import { enterAnimation } from '../animations/enter-animation';


@Component({
  selector: 'app-simulation-navigation',
  templateUrl: './simulation-navigation.component.html',
  styleUrls: ['./simulation-navigation.component.scss'],
  animations: [ enterAnimation ],
})
export class SimulationNavigationComponent implements OnInit, OnDestroy {
  @ViewChild('file', { static: false }) file;
  private subscription: any;
  public filteredSimulations: Data[] = [];
  public searchTerm: string = '';
  public selectionList: boolean = false;
  public simulations: Data[];
  public fileReader = new FileReader();
  public quickview: boolean = false;

  constructor(
    private _networkSketchService: NetworkSketchService,
    private _simulationProtocolService: SimulationProtocolService,
    private _simulationRunService: SimulationRunService,
    private router: Router,
    public _navigationService: NavigationService,
    public _simulationService: SimulationService,
  ) {
    this.fileReader.addEventListener("load", event => {
      var result = JSON.parse(event['target']['result'] as string);
      var protocols = result.hasOwnProperty("_id") ? [result] : result;
      this._simulationProtocolService.upload(protocols);
    });
  }

  ngOnInit(): void {
    this.update()
    this.subscription = this._simulationProtocolService.change.subscribe(() => this.update())
  }

  ngOnDestroy(): void {
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
    var url = 'simulation/' + id;
    this.router.navigate([{ outlets: { primary: url } }]);
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
    this.navigate('')
  }

  details(): void {
    this.selectionList = false;
    this._simulationService.mode = 'details';
  }

  showSaveButton() {
    return !(this._simulationService.data._id || this.simulations.includes(this._simulationService.data))
  }

  save(): void {
    this._simulationProtocolService.save(this._simulationService.data)
  }

  run(): void {
    this.selectionList = false;
    this._simulationService.mode = 'run';
  }

  displaySaveButton(): boolean {
    return this._simulationService.data.name != '' && this._simulationService.data._id == '';
  }

  clearSimulationName(): void {
    this._simulationService.data.name = '';
    this._simulationService.data._id = '';
  }

  onChange(event: any): void {
    this._simulationService.data._id = '';
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
