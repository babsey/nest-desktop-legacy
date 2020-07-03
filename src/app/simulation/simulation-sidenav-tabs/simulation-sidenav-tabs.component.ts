import { ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

import { AppConfigService } from '../../config/app-config/app-config.service';
import { NetworkService } from '../../network/services/network.service';
import { SimulationService } from '../services/simulation.service';
import { SimulationEventService } from '../services/simulation-event.service';
import { SimulationRunService } from '../services/simulation-run.service';
import { SimulationCodeService } from '../simulation-code/simulation-code.service';
import { VisualizationService } from '../../visualization/visualization.service';


@Component({
  selector: 'app-simulation-sidenav-tabs',
  templateUrl: './simulation-sidenav-tabs.component.html',
  styleUrls: ['./simulation-sidenav-tabs.component.scss']
})
export class SimulationSidenavTabsComponent implements OnInit {
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private _appConfigService: AppConfigService,
    private _networkService: NetworkService,
    private _simulationRunService: SimulationRunService,
    private _simulationCodeService: SimulationCodeService,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    public _simulationService: SimulationService,
    public _simulationEventService: SimulationEventService,
    public _visualizationService: VisualizationService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1023px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    if (['stats'].includes(this._simulationService.sidenavMode)) {
      this._simulationService.sidenavMode = 'networkController'
    }
  }

  selectControllerMode(mode: string): void {
    if (this._simulationService.sidenavMode == mode) {
      this._simulationService.sidenavOpened = !this._simulationService.sidenavOpened;
    } else {
      this._simulationService.sidenavMode = mode;
      this._simulationService.sidenavOpened = true;
    }
    if (mode == 'codeEditor' && this._simulationService.sidenavOpened == true) {
      this._simulationService.code = this._simulationCodeService.generate(this._simulationService.data);
    }
    this._simulationRunService.mode = (mode == 'codeEditor' ? 'code' : 'object');
    setTimeout(() => this.triggerResize(), 500)
  }

  triggerResize(): void {
    window.dispatchEvent(new Event('resize'));
  }

  toggleSidenav(): void {
    this._simulationService.sidenavOpened = !this._simulationService.sidenavOpened;
  }

  toggleQuickView(): void {
    this._networkService.quickView = !this._networkService.quickView;
  }

  isQuickViewOpened(): boolean {
    return this._networkService.quickView;
  }

  devMode(): boolean {
    return this._appConfigService.config.app.devMode == true;
  }

}
