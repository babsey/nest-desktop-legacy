import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { environment } from '../../../environments/environment';

import { AppService } from '../app/app.service';
import { ModelConfigService } from './model-config.service';


@Injectable({
  providedIn: 'root'
})
export class ModelService {
  public sidenavMode: string = 'list';
  public sidenavOpened: boolean = true;
  public params: string = 'list';
  public enabledModel: boolean = false;
  public selectedModel: string = '';                      // Important: it has to be string;
  public status: any = {
    ready: false,
    valid: false,
  };
  public version: string;
  public defaults: any = {};
  public progress: boolean = false;
  public update: EventEmitter<any> = new EventEmitter();

  constructor(
    private _appService: AppService,
    private _modelConfigService: ModelConfigService,
    private _http: HttpClient,
  ) {
  }

  requestModelDefaults(): void {
    const urlRoot: string = this._appService.data.nestServer.url;
    this.defaults = {};
    this.progress = true;
    const modelId = this.selectedModel;
    setTimeout(() => {
      this._http.post(urlRoot + '/api/nest/GetDefaults', { model: modelId })
        .subscribe(resp => {
          // console.log(resp)
          this.progress = false;
          this.defaults = resp;
        }, err => {
          console.log(err)
        })
    }, 500)
  }

  selectModel(modelId: string): void {
    this.selectedModel = undefined;
    setTimeout(() => {
      this.selectedModel = modelId;
      if (!this.selectedModel) {
        this.sidenavMode = 'list';
      }
      this.requestModelDefaults();
    }, 1)
  }

  getSettings(modelId: string): any {
    return this._appService.data.getModel(modelId) || {};
  }

  isSelected(model: string): boolean {
    return this.selectedModel === model;
  }

  hasModel(modelId: string = null): boolean {
    modelId = modelId || this.selectedModel;
    return this._appService.data.getModel(modelId) !== undefined;
  }

  label(modelId: string = null): string {
    modelId = modelId || this.selectedModel;
    const model: any = this._appService.data.getModel(modelId);
    return model ? model.label : modelId;
  }

}
