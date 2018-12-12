import {
  Injectable,
  EventEmitter
} from '@angular/core';

import { ConfigService } from '../config/config.service';


@Injectable({
  providedIn: 'root'
})
export class ControllerService {
  public options: any = {
    opened: true,
    sheetOpened: false,
    edit: false,
  };

  constructor(
    private _configService: ConfigService,
  ) {
  }

  display(level) {
    return level > this._configService.config.app.controller.level ? 'None' : ''
  }


}
