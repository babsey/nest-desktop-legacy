import { Injectable, EventEmitter } from '@angular/core';

import { SimulationConfigService } from '../simulation-config/simulation-config.service';


@Injectable({
  providedIn: 'root'
})
export class SimulationControllerService {
  public options: any = {
    sidenavOpened: true,
    editing: false,
  };
  public selected: any = null;
  public mode: string = 'network';

  constructor(
    private _simulationConfigService: SimulationConfigService,
  ) {
  }

  display(level: number): boolean {
    return level <= this._simulationConfigService.config.level;
  }

  edit(mode: string = null): void {
    this.options.editing = (mode != null) ? mode : !this.options.editing;
  }

  openBottomSheet(): void {
    this._simulationConfigService.config.bottomSheetOpened = true;
    this._simulationConfigService.save()
  }

  closeBottomSheet(): void {
    this._simulationConfigService.config.bottomSheetOpened = false;
    this._simulationConfigService.save()
  }

}
