import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  public mode: string = 'networkEditor';
  public sidenavMode: string = 'networkSelection';
  public sidenavOpened: boolean = false;
  public networkQuickView: boolean = false;

  constructor() {
  }

  selectMode(mode: string): void {
    this.mode = mode;
    this.sidenavOpened = mode !== 'labBook';
    setTimeout(() => this.triggerResize(), 10);
  }

  isMode(mode: string): boolean {
    return this.mode === mode;
  }

  isSidenavMode(mode: string): boolean {
    return this.sidenavMode === mode;
  }

  triggerResize(): void {
    window.dispatchEvent(new Event('resize'));
  }

}
