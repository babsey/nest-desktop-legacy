import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppConfigService } from '../../config/app-config/app-config.service';
import { NavigationService } from '../../navigation/navigation.service';
import { ModelService } from '../model.service';


@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.scss']
})
export class ModelListComponent implements OnInit, OnDestroy {
  private subscription: any;
  public availableModels: any[] = [];
  public enabledModels: any[] = [];
  public filteredModels: any[] = [];
  public elementType: string = 'all';
  public searchTerm: string = '';
  public view: string = 'enabled';
  public icons: any = {
    'stimulator': 'sign-in-alt',
    'neuron': 'circle',
    'recorder': 'sign-in-alt',
  };

  constructor(
    private http: HttpClient,
    public _appConfigService: AppConfigService,
    public _modelService: ModelService,
    public _navigationService: NavigationService,
  ) { }

  ngOnInit() {
    this.update()
    this.subscription = this._modelService.update.subscribe(() => this.update())
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  update() {
    this.enabledModels = this._modelService.list();
    this.requestModels().subscribe(data => {
      this.availableModels = data['response']['data'];
      this.filterModels()
    })
  }

  requestModels() {
    var urlRoot = this._appConfigService.urlRoot();
    return this.http.get(urlRoot + '/api/nest/Models')
  }

  filterModelsByType() {
    if (this.elementType != 'all') {
      let result: string[] = [];
      for (let model of this.filteredModels) {
        if ((model.indexOf('synapse') != -1) || (model.indexOf('connection') != -1) || (model.indexOf('junction') != -1)) {
          if (this.elementType == 'synapse') {
            result.push(model)
          }
        } else if ((model.indexOf('generator') != -1) || (model.indexOf('dilutor') != -1)) {
          if (this.elementType == 'stimulator') {
            result.push(model)
          }
        } else if ((model.indexOf('recorder') != -1) || (model.indexOf('meter') != -1) || (model.indexOf('detector') != -1)) {
          if (this.elementType == 'recorder') {
            result.push(model)
          }
        } else if (model.indexOf('transmitter') != -1) {
          if (this.elementType == 'other') {
            result.push(model)
          }
        } else {
          if (this.elementType == 'neuron') {
            result.push(model)
          }
        }
      }
      this.filteredModels = result
    }
  }

  filterModelsBySearch() {
    var searchTerm = this.searchTerm;
    if (searchTerm) {
      let result: string[] = [];
      for (let model of this.filteredModels) {
        if (model.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1) {
          result.push(model)
        }
      }
      this.filteredModels = result;
    }
  }

  filterModels() {
    this.enabledModels = this._modelService.list();
    this.filteredModels = this.view == 'available' ? this.availableModels : this.enabledModels;
    this.filterModelsByType()
    this.filterModelsBySearch()
  }

  search(query: string) {
    this.searchTerm = query;
    this.filterModels()
  }

  viewModels(view) {
    this.view = view;
    this.filterModels()
  }

  selectElementType(elementType: string) {
    this.elementType = elementType;
    this.filterModels()
  }

  isSelected(model) {
    return this._modelService.selectedModel == model;
  }

  isEnabled(model) {
    return this._modelService.hasModel(model);
  }

  resetModelConfigs() {
    this._modelService.reset()
  }

  shortLabel(label) {
    return label.split('_').map(d => d[0]).join('')
  }

}
