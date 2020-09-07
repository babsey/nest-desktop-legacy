import { ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

import { AppService } from '../../../services/app/app.service';
import { ModelService } from '../../../services/model/model.service';


@Component({
  selector: 'app-model-sidenav-tabs',
  templateUrl: './model-sidenav-tabs.component.html',
  styleUrls: ['./model-sidenav-tabs.component.scss']
})
export class ModelSidenavTabsComponent implements OnInit {
  private _mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private _appService: AppService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _media: MediaMatcher,
    private _modelService: ModelService,
  ) {
    this._mobileQuery = _media.matchMedia('(max-width: 1023px)');
    this._mobileQueryListener = () => _changeDetectorRef.detectChanges();
    this._mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
  }

  get mobileQuery(): MediaQueryList {
    return this._mobileQuery;
  }

  toggleSidenav(): void {
    this._modelService.sidenavOpened = !this._modelService.sidenavOpened;
  }

  setSidenavMode(mode: string): void {
    this._modelService.sidenavMode = mode;
  }

  isSidenavMode(mode: string): boolean {
    return this._modelService.sidenavMode === mode;
  }

  isSidenavOpened(): boolean {
    return this._modelService.sidenavOpened;
  }

  hasModel(): boolean {
    return this._modelService.hasModel();
  }

}
