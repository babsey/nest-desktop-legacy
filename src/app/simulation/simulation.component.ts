import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MediaMatcher } from '@angular/cdk/layout';

import { AnimationControllerService } from '../visualization/animation/animation-controller/animation-controller.service';
import { NetworkService } from '../network/services/network.service';
import { SimulationEventService } from './services/simulation-event.service';
import { SimulationRunService } from './services/simulation-run.service';
import { SimulationService } from './services/simulation.service';
import { SimulationCodeService } from './simulation-code/simulation-code.service';
import { VisualizationService } from '../visualization/visualization.service';

import { Data } from '../classes/data';

import { enterAnimation } from '../animations/enter-animation';


@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss'],
  animations: [enterAnimation],
})
export class SimulationComponent implements OnInit, OnDestroy {
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private _animationControllerService: AnimationControllerService,
    private _networkService: NetworkService,
    private _simulationCodeService: SimulationCodeService,
    private _visualizationService: VisualizationService,
    private bottomSheet: MatBottomSheet,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private route: ActivatedRoute,
    private router: Router,
    public _simulationEventService: SimulationEventService,
    public _simulationRunService: SimulationRunService,
    public _simulationService: SimulationService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1023px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    // console.log('Init simulation')
    this.route.params.subscribe(params => this.init(params['id']));
  }

  ngOnDestroy(): void {
    this.bottomSheet.dismiss()
  }

  init(id: string): void {
    this._simulationService.dataLoaded = false;
    this._simulationEventService.records = [];
    if (id) {
      this._simulationService.load(id).then(doc => {
        this._simulationService.data = new Data(doc);
        this._simulationService.code = this._simulationCodeService.generate(this._simulationService.data);
        this._networkService.update.emit(this._simulationService.data);
        this._simulationService.dataLoaded = true;
        if (this.router.url.includes('run') || this._simulationRunService.config['runAfterLoad']) {
          this.run(true)
        }
      })
    } else {
      this._simulationService.data = new Data();
      this._simulationService.code = this._simulationCodeService.generate(this._simulationService.data);
      this._simulationService.mode = 'networkEditor';
      this._simulationService.dataLoaded = true;
    }
  }

  run(force: boolean = false): void {
    this._simulationService.mode = 'activityExplorer';
    this._animationControllerService.stop();
    if (this._networkService.recorderChanged) {
      this._simulationEventService.records = [];
      this._networkService.recorderChanged = false;
    }
    this._simulationRunService.run(this._simulationService.data, force)
  }

  triggerResize(): void {
    window.dispatchEvent(new Event('resize'));
  }

  toggleQuickView(): void {
    this._networkService.quickView = !this._networkService.quickView;
  }

  isQuickViewOpened(): boolean {
    return this._networkService.quickView;
  }

  onOpenedStart(event: any): void {
    if (this._simulationService.mode == 'labBook') {
      this._simulationService.mode = 'networkEditor';
    }
  }

  onClosedStart(event: any): void {
    if (this._simulationService.mode == 'networkEditor') {
      this._simulationService.mode = 'labBook';
    }
  }

  onOpenedChange(event: any): void {
    setTimeout(() => this.triggerResize(), 10)
  }

  onDataChange(data: Data): void {
    // console.log('Simulation on data change')
    this._simulationService.data._id = '';
    setTimeout(() => {
      this._simulationService.code = this._simulationCodeService.generate(this._simulationService.data);
      if (this._simulationService.mode == 'activityExplorer') {
        this.run()
      }
    }, 1)
  }

  onAppChange(data: any): void {
    // console.log('On app change')
    this._simulationService.data._id = '';
    setTimeout(() => {
      this._simulationService.code = this._simulationCodeService.generate(this._simulationService.data);
    }, 1)
    this._visualizationService.init.emit()
  }

}
