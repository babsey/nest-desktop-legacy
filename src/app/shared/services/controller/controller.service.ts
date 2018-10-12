import {
  Injectable,
  EventEmitter
} from '@angular/core';

import { ConfigService } from '../config/config.service';


@Injectable({
  providedIn: 'root'
})
export class ControllerService {
  public options: any;
  public update: EventEmitter<any>;

  constructor(
    private _configService: ConfigService,
  ) {
    this.options = {
      opened: true,
      width: '360px',
      color: "#fafafa",
      level: 1,
    };

    this.update = new EventEmitter();
  }

  display(level) {
    return level > this._configService.config.app.controller.level ? 'None' : ''
  }


}
