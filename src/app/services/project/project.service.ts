import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private _mode = 'networkEditor';
  private _networkQuickView = false;
  private _sidenavMode = 'networkSelection';
  private _sidenavOpened = false;

  constructor() {
  }

  get mode(): string {
    return this._mode;
  }

  set mode(value: string) {
    this._mode = value;
    if (this.mode === 'labBook') {
      this._sidenavOpened = false;
    }
    setTimeout(() => window.dispatchEvent(new Event('resize')), 10);
  }

  get networkQuickView(): boolean {
    return this._networkQuickView;
  }

  set networkQuickView(value: boolean) {
    this._networkQuickView = value;
  }

  get sidenavMode(): string {
    return this._sidenavMode;
  }

  set sidenavMode(value: string) {
    this._sidenavMode = value;
  }

  get sidenavOpened(): boolean {
    return this._sidenavOpened;
  }

  set sidenavOpened(value: boolean) {
    this._sidenavOpened = value;
  }

}
