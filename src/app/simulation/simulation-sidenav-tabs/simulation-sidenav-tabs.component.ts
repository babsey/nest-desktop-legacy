import { ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

import { NetworkService } from '../../network/services/network.service';
import { SimulationService } from '../services/simulation.service';
import { SimulationEventService } from '../services/simulation-event.service';
import { SimulationRunService } from '../services/simulation-run.service';
import { SimulationScriptService } from '../simulation-script/simulation-script.service';
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
    private _networkService: NetworkService,
    private _simulationRunService: SimulationRunService,
    private _simulationScriptService: SimulationScriptService,
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
  }

  selectControllerMode(mode: string): void {
    if (this._simulationService.sidenavMode == mode) {
      this._simulationService.sidenavOpened = !this._simulationService.sidenavOpened;
    } else {
      this._simulationService.sidenavMode = mode;
      this._simulationService.sidenavOpened = true;
    }
    this._simulationRunService.mode = (mode == 'script' ? 'script' : 'object');
    if (this._simulationService.sidenavMode == 'script') {
      this._simulationService.script = this._simulationScriptService.script(this._simulationService.data);
    }
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

}
