import { Directive, HostListener } from '@angular/core';

import { AppService } from '../services/app/app.service';


@Directive({
  selector: '[appContextMenuTrigger]'
})
export class ContextMenuTriggerDirective {

  constructor(
    private _appService: AppService,
  ) { }

  @HostListener('mouseenter') onMouseEnter() {
    this._appService.rightClick = true;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this._appService.rightClick = false;
  }

}
