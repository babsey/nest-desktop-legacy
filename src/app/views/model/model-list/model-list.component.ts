import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { listAnimation } from '../../../animations/list-animation';

import { App } from '../../../components/app';
import { Model } from '../../../components/model/model';

import { AppService } from '../../../services/app/app.service';
import { ModelService } from '../../../services/model/model.service';


@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.scss'],
  animations: [listAnimation]
})
export class ModelListComponent implements OnInit, OnDestroy {
  private _filteredModels: string[] = [];
  private _models: string[] = [];
  private _searchTerm = '';
  private _subscription: any;
  private _view = 'enabled';

  constructor(
    private _appService: AppService,
    private _modelService: ModelService,
    private _router: Router,
  ) { }

  ngOnInit() {
    this._subscription = this._modelService.update.subscribe((): void => this.update());
    this.update();
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
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

  hasModel(model: string): boolean {
    return this._modelService.hasModel(model);
  }

  isModelSelected(model: string): boolean {
    return this._modelService.isSelected(model);
  }

  selectModel(model: string): void {
    this._modelService.selectModel(model);
  }

  resetModels(): void {
    this._router.navigate([{ outlets: { primary: null, nav: 'model' } }]);
    this._modelService.selectedModel = '';
    this._appService.app.resetModelDatabase();
  }

  update(): void {
    const urlRoot: string = this._appService.app.nestServer.url;
    this._appService.app.nestServer.http.get(urlRoot + '/api/Models')
      .then((req: any) => {
        if (req.status === 200) {
          const models: string[] = JSON.parse(req.responseText);
          this._models = models;
          this.filterModels();
        }
      })
      .catch((req: any) => {
        console.log(req);
      });
  }

  filterModelsBySearch(): void {
    if (this.searchTerm) {
      const result: string[] = [];
      for (const model of this.filteredModels) {
        if (model.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1) {
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
