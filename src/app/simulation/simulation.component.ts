import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatBottomSheet } from '@angular/material';

import { ControllerSheetComponent } from '../controller/controller-sheet/controller-sheet.component';

import {
  faChevronUp,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

import { ChartService } from '../chart/chart.service';
import { ConfigService } from '../config/config.service';
import { ControllerService } from '../controller/controller.service';
import { DataService } from '../services/data/data.service';
import { NavigationService } from '../navigation/navigation.service';
import { NetworkService } from '../services/network/network.service';
import { ProtocolService } from '../services/protocol/protocol.service';
import { SimulationService } from './simulation.service';
import { SketchService } from '../sketch/sketch.service';


@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})
export class SimulationComponent implements OnInit {
  @ViewChild('content') content: any;

  public faChevronUp = faChevronUp;
  public faTimes = faTimes;

  constructor(
    private route: ActivatedRoute,
    public _chartService: ChartService,
    public _configService: ConfigService,
    public _controllerService: ControllerService,
    public _dataService: DataService,
    private _navigationService: NavigationService,
    private _networkService: NetworkService,
    private _protocolService: ProtocolService,
    public _simulationService: SimulationService,
    public _sketchService: SketchService,
    private bottomSheet: MatBottomSheet,
  ) {
  }

  ngOnInit() {
    this.resize()
    if (this._dataService.options.ready) {
      setTimeout(() => {
        this._simulationService.run()
      }, 100)
    } else {
      let paramMap = this.route.snapshot.paramMap;
      let id = paramMap.get('id');
      let source = paramMap.get('source');
      if (id && source) {
        this._navigationService.options.source = source;
        let service = source == 'protocol' ? this._protocolService : this._networkService;
        service.load(this._dataService, id).then(() => {
          this._simulationService.run()
        })
      }
    }
  }

  resize() {
    // console.log('resize')
    setTimeout(() => {
      var height = this.content.elementRef.nativeElement.clientHeight;
      var width = this.content.elementRef.nativeElement.clientWidth;
      this._chartService.resize(width, height)
    }, 800)
  }

  toggleControllerSheet() {
    this._controllerService.options.sheetOpened = !this._controllerService.options.sheetOpened;
    if (this._controllerService.options.sheetOpened) {
      this.bottomSheet.open(ControllerSheetComponent, {
        autoFocus: false,
        hasBackdrop: false,
        closeOnNavigation: true,
        disableClose: true,
      });
    } else {
      this.bottomSheet.dismiss()
    }
  }

}
