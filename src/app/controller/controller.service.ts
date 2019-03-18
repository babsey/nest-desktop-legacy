import { Injectable, EventEmitter } from '@angular/core';

import { AppConfigService } from '../config/app-config/app-config.service';
import { ControllerConfigService } from '../config/controller-config/controller-config.service';


@Injectable({
  providedIn: 'root'
})
export class ControllerService {
  public options: any = {
    sidenavOpened: true,
    editing: false,
  };
  public selected: any = null;

  constructor(
    private _appConfigService: AppConfigService,
    private _controllerConfigService: ControllerConfigService,
  ) {
  }

  display(level) {
    var value = level <= this._controllerConfigService.config.level;
    return value
  }

  edit(mode = null) {
    this.options.editing = (mode != null) ? mode : !this.options.editing;
  }

  openBottomSheet() {
    this._controllerConfigService.config.bottomSheetOpened = true;
    this._controllerConfigService.save()
  }

  closeBottomSheet() {
    this._controllerConfigService.config.bottomSheetOpened = false;
    this._controllerConfigService.save()
  }

}
