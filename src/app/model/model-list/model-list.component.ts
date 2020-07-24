import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppService } from '../../app.service';
import { ModelService } from '../model.service';

import { listAnimation } from '../../animations/list-animation';

import { Model } from '../../components/model';


@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.scss'],
  animations: [ listAnimation ]
})
export class ModelListComponent implements OnInit, OnDestroy {
  private subscription: any;
  public availableModels: string[] = [];
  public enabledModels: string[] = [];
  public filteredModels: string[] = [];
  public searchTerm: string = '';
  public view: string = 'enabled';

  constructor(
    private http: HttpClient,
    public _appService: AppService,
    public _modelService: ModelService,
  ) { }

  ngOnInit() {
    this.subscription = this._modelService.update.subscribe((): void => this.update());
    this.update();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  update(): void {
    this.enabledModels = this._appService.data.filterModels().map(model => model.id);
    const urlRoot: string = this._appService.data.nestServer.url;
    this.http.get(urlRoot + '/api/nest/Models').subscribe(resp => {
      this.availableModels = Object.entries(resp).map(entry => entry[1]);
      this.filterModels();
    })
  }

  filterModelsBySearch(): void {
    if (this.searchTerm) {
      let result: string[] = [];
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
