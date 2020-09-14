import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { App } from '../../components/app';
import { Model } from '../../components/model/model';

import { AppService } from '../app/app.service';


@Injectable({
  providedIn: 'root'
})
export class ModelService {
  private _defaults: any = {};
  private _progress = false;
  private _selectedModel = '';     // Important: it has to be string;
  private _sidenavMode = 'list';
  private _sidenavOpened = true;
  private _update: EventEmitter<any> = new EventEmitter();

  constructor(
    private _appService: AppService,
    private _http: HttpClient,
  ) {
  }

  get app(): App {
    return this._appService.app;
  }

  get defaults(): any {
    return this._defaults;
  }

  get progress(): boolean {
    return this._progress;
  }

  get selectedModel(): string {
    return this._selectedModel;
  }

  set selectedModel(value: string) {
    this._selectedModel = value;
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

  get update(): EventEmitter<any> {
    return this._update;
  }

  requestModelDefaults(): void {
    const urlRoot: string = this.app.nestServer.url;
    this._defaults = {};
    this._progress = true;
    const modelId: string = this.selectedModel;
    setTimeout(() => {
      this._http.post(urlRoot + '/api/GetDefaults', { model: modelId })
        .subscribe((resp: any) => {
          // console.log(resp)
          this._progress = false;
          this._defaults = resp;
        }, (err: any) => {
          console.log(err);
        });
    }, 500);
  }

  selectModel(modelId: string): void {
    this.selectedModel = undefined;
    setTimeout(() => {
      this.selectedModel = modelId;
      if (!this.selectedModel) {
        this._sidenavMode = 'list';
      }
      this.requestModelDefaults();
    }, 1);
  }

  isSelected(model: string): boolean {
    return this.selectedModel === model;
  }

  label(modelId: string = null): string {
    modelId = modelId || this.selectedModel;
    const model: any = this.app.getModel(modelId);
    return model.label || modelId;
  }

  getModel(modelId: string): Model {
    return this.app.getModel(modelId);
  }

  hasModel(modelId: string = null): boolean {
    return this.app.hasModel(modelId || this.selectedModel);
  }

  addModel(): void {
    const modelId: string = this.selectedModel;
    const model: any = {
      id: modelId,
      elementType: this.defaults.element_type,
      label: modelId,
      params: [],
    };
    if (this.defaults.hasOwnProperty('recordables')) {
      model['recordables'] = this.defaults.recordables;
    }
    this.app.addModel(model).then(() => this.app.initModels());
    this.update.emit();
  }

  deleteModel(): void {
    const model: Model = this.app.getModel(this.selectedModel);
    if (model) {
      model.delete().then(() => this.app.initModels());
      this.update.emit();
    }
  }

  saveModel(): void {
    const model: Model = this.app.getModel(this.selectedModel);
    if (model) {
      model.save();
    }
  }

}
