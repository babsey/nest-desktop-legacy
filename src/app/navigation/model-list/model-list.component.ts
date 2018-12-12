import { Component, OnInit } from '@angular/core';

import { ConfigService } from '../../config/config.service';
import { ModelService } from '../../model/model.service';

import {
  faEraser,
  faPlus,
  faSearch,
  faEllipsisV,
  faEdit,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.css']
})
export class ModelListComponent implements OnInit {
  public availableModels: any;
  public enabledModels: any;
  public filteredModels: any = [];

  public faEraser = faEraser;
  public faPlus = faPlus;
  public faSearch = faSearch;
  public faEllipsisV = faEllipsisV;
  public faEdit = faEdit;
  public faChevronLeft = faChevronLeft;

  constructor(
    public _configService: ConfigService,
    public _modelService: ModelService,
  ) { }

  ngOnInit() {
    this._configService.check()
    this.update()
  }

  update() {
    this.enabledModels = this._configService.listModels();
    this._modelService.getModels().subscribe(data => {
      this.availableModels = data['response']['data'];
      this.filterModels()
    })
  }

  filterModelsByType() {
    var element_type = this._modelService.element_type
    if (element_type != 'all') {
      let result: string[] = [];
      for (let model of this.filteredModels) {
        if ((model.indexOf('synapse') != -1) || (model.indexOf('connection') != -1) || (model.indexOf('junction') != -1)) {
          if (element_type == 'synapse') {
            result.push(model)
          }
        } else if ((model.indexOf('generator') != -1) || (model.indexOf('dilutor') != -1)) {
          if (element_type == 'stimulator') {
            result.push(model)
          }
        } else if ((model.indexOf('recorder') != -1) || (model.indexOf('meter') != -1) || (model.indexOf('detector') != -1)) {
          if (element_type == 'recorder') {
            result.push(model)
          }
        } else if (model.indexOf('transmitter') != -1) {
          if (element_type == 'other') {
            result.push(model)
          }
        } else {
          if (element_type == 'neuron') {
            result.push(model)
          }
        }
      }
      this.filteredModels = result
    }
  }

  filterModelsBySearch() {
    var searchTerm = this._modelService.searchTerm;
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
    this.filteredModels = this._modelService.view == 'available' ? this.availableModels : this.enabledModels;
    this.filterModelsByType()
    this.filterModelsBySearch()
  }

  search(query: string) {
    this._modelService.searchTerm = query;
    this.filterModels()
  }

  viewModels(view) {
    this._modelService.view = view;
    this.filterModels()
  }

  selectElementType(element_type: string) {
    this._modelService.element_type = element_type;
    this.filterModels()
  }

  selectModel(model) {
    this._modelService.selectModel(model);
    this._configService.selectModel(model);
    this._modelService.getDoc(model);
    this._modelService.getDefaults(model);
  }

  isSelected(model) {
    return this._modelService.selectedModel == model;
  }

  isEnabled(model) {
    return this.enabledModels.indexOf(model) != -1;
  }

  toggleModelActivation(event, model) {
    if (event.checked) {
      this.selectModel(model)
      setTimeout(() => {
        var element_type = 'synapse_model' in this._modelService.defaults ? 'synapse': this._modelService.defaults.element_type;
        this._configService.addModel(element_type, model);
        this.enabledModels = this._configService.listModels();
      }, 1000)
    } else {
      this._configService.removeModel(model);
      this.enabledModels = this._configService.listModels();
    }
  }

  resetNESTConfig() {
    delete localStorage._nestdesktop_config_nest;
    this._configService.syncNESTConfig()
    this.enabledModels = this._configService.listModels();
    this.filterModels()
  }
}
