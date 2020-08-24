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
  public availableModels: string[] = [];
  public enabledModels: string[] = [];
  public filteredModels: string[] = [];
  public searchTerm: string = '';
  public view: string = 'available';

  constructor(
    private _http: HttpClient,
    private _appService: AppService,
    public modelService: ModelService,
  ) { }

  ngOnInit() {
    this._subscription = this.modelService.update.subscribe((): void => this.update());
    setTimeout(() => this.update(), 1000);
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  get app(): App {
    return this._appService.data;
  }

  update(): void {
    this.enabledModels = this.app.filterModels().map(model => model.id);
    const urlRoot: string = this.app.nestServer.url;
    this._http.get(urlRoot + '/api/nest/Models').subscribe(resp => {
      this.availableModels = Object.entries(resp).map(entry => entry[1]);
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
      this.filteredModels = result;
    }
  }

  filterModels(): void {
    this.filteredModels = this.view === 'available' ? this.availableModels : this.enabledModels;
    this.filterModelsBySearch();
  }

  search(query: string): void {
    this.searchTerm = query;
    this.filterModels();
  }

  viewModels(view: string): void {
    this.view = view;
    this.filterModels();
  }

}
