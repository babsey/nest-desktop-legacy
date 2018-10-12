import { MediaMatcher } from '@angular/cdk/layout'
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core'

import {
  MatDialog,
  MatSnackBar,
} from '@angular/material'

import {
  faBars,
  faEllipsisV,
} from '@fortawesome/free-solid-svg-icons'

import { ChartService } from '../shared/services/chart/chart.service'
import { ConfigService } from '../shared/services/config/config.service'
import { ControllerService } from '../shared/services/controller/controller.service'
import { DataService } from '../shared/services/data/data.service'
import { NetworkService } from '../shared/services/network/network.service'
import { SimulationService } from '../shared/services/simulation/simulation.service'
import { SketchService } from '../shared/services/sketch/sketch.service'


@Component({
  selector: 'app-simulation-workspace',
  templateUrl: './simulation-workspace.component.html',
  styleUrls: ['./simulation-workspace.component.css']
})
export class SimulationWorkspaceComponent implements OnInit {
  public mobileQuery: MediaQueryList;

  public faBars = faBars;
  public faEllipsisV = faEllipsisV;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private snackBar: MatSnackBar,
    public _chartService: ChartService,
    public _configService: ConfigService,
    public _controllerService: ControllerService,
    public _dataService: DataService,
    public _networkService: NetworkService,
    public _simulationService: SimulationService,
    public _sketchService: SketchService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  resize() {
    // console.log('Resize')
    let height = window.innerHeight - 68;
    let width = window.innerWidth - 50;
    this._sketchService.options.width = width;
    this._sketchService.options.height = height;
    this._sketchService.update.emit();
    this._chartService.update.emit();
  }

  ngOnInit() {
    this._simulationService.run()
    setTimeout(() => {
      this.resize()
    }, 200)

  }
}
