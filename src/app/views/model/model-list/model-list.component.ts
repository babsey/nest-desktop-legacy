import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { listAnimation } from '../../../animations/list-animation';

import { App } from '../../../components/app';
import { Model } from '../../../components/model/model';

import { AppService } from '../../../services/app/app.service';
import { ModelService } from '../../../services/model/model.service';


@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.scss'],
  animations: [ listAnimation ]
})
export class ModelListComponent implements OnInit, OnDestroy {
  private _subscription: any;
  private _models: string[] = [];
  private _filteredModels: string[] = [];
  private _searchTerm: string = '';
  private _view: string = 'enabled';

  constructor(
    private _http: HttpClient,
    private _appService: AppService,
    public modelService: ModelService,
  ) { }

  ngOnInit() {
    this._subscription = this.modelService.update.subscribe((): void => this.update());
    this.update();
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  get app(): App {
    return this._appService.app;
  }

  get filteredModels(): string[] {
    return this._filteredModels;
  }

  get searchTerm(): string {
    return this._searchTerm;
  }

  get view(): string {
    return this._view;
  }

  set view(value: string) {
    this._view = value;
  }

  update(): void {
    const urlRoot: string = this.app.nestServer.url;
    this._http.get(urlRoot + '/api/Models').subscribe(resp => {
      this._models = Object.entries(resp).map(entry => entry[1]);
      this.filterModels();
    })
  }

  filterModelsBySearch(): void {
    if (this.searchTerm) {
      const result: string[] = [];
      for (let model of this.filteredModels) {
        if (model.toLowerCase().indexOf(this.searchTerm.toLowerCase()) != -1) {
          result.push(model);
        }
      }
      this._filteredModels = result;
    }
  }

  filterModels(): void {
    this._filteredModels = this._models;
    this.filterModelsBySearch();
  }

  search(query: string): void {
    this._searchTerm = query;
    this.filterModels();
  }

}
