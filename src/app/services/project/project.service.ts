import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private _mode: string = 'networkEditor';
  private _networkQuickView: boolean = false;
  private _sidenavMode: string = 'networkSelection';
  private _sidenavOpened: boolean = false;

  constructor() {
  }

  get mode(): string {
    return this._mode;
  }

  set mode(value: string) {
    this._mode = value;
    this._sidenavOpened = value !== 'labBook';
    setTimeout(() => window.dispatchEvent(new Event('resize')), 10);
  }

  get networkQuickView(): boolean {
    return this._networkQuickView;
  }

  set networkQuickView(value: boolean) {
    this._networkQuickView = value
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
