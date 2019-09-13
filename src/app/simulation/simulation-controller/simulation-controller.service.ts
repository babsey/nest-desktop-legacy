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

  constructor(
    private _simulationConfigService: SimulationConfigService,
  ) {
  }

  display(level) {
    var value = level <= this._simulationConfigService.config.level;
    return value
  }

  edit(mode = null) {
    this.options.editing = (mode != null) ? mode : !this.options.editing;
  }

  openBottomSheet() {
    this._simulationConfigService.config.bottomSheetOpened = true;
    this._simulationConfigService.save()
  }

  closeBottomSheet() {
    this._simulationConfigService.config.bottomSheetOpened = false;
    this._simulationConfigService.save()
  }

}
