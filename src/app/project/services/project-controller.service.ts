import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ProjectControllerService {
  public options: any = {
    sidenavOpened: true,
    editing: false,
  };
  public selected: any = null;
  public mode: string = 'network';

  constructor() {
  }

  edit(mode: string = null): void {
    this.options.editing = (mode != null) ? mode : !this.options.editing;
  }

}
