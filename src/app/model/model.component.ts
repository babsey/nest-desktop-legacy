import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AppConfigService } from '../config/app-config/app-config.service';
import { ModelService } from './model.service';
import { NavigationService } from '../navigation/navigation.service';

import { enterAnimation } from '../animations/enter-animation';


@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss'],
  animations: [ enterAnimation ],
})
export class ModelComponent implements OnInit, OnDestroy {
  public enabled: boolean = false;

  constructor(
    private _appConfigService: AppConfigService,
    private _navigationService: NavigationService,
    private route: ActivatedRoute,
    public _modelService: ModelService,
  ) { }

  ngOnInit() {
    let paramMap = this.route.snapshot.paramMap;
    let model = paramMap.get('model');
    if (model) {
      this._modelService.selectModel(model);
    }
  }

  ngOnDestroy() {
    this._modelService.selectedModel = '';
  }

  advanced(): boolean {
    return this._appConfigService.config['app'].advanced;
  }

  addModel(): void {
    var model = this._modelService.selectedModel;
    var config = {
      id: model,
      element_type: this._modelService.elementType,
      label: '',
      params: []
    };
    this._modelService.models[model] = config;
    // this._modelService.save(config)
  }

  removeModel(): void {
    var model = this._modelService.selectedModel;
    delete this._modelService.models[model]
    // this._modelService.delete(this.model)
  }

  changeModel(event: any): void {
    if (event.checked) {
      this.addModel();
    } else {
      this.removeModel();
    }
    this._modelService.enabledModel = this._modelService.hasModel();
    this._modelService.update.emit()
  }

}
