import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { enterAnimation } from '../../animations/enter-animation';

import { ModelService } from '../../services/model/model.service';


@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss'],
  animations: [ enterAnimation ],
})
export class ModelComponent implements OnInit, OnDestroy {

  constructor(
    private _route: ActivatedRoute,
    private _modelService: ModelService,
  ) { }

  ngOnInit() {
    const paramMap: any = this._route.snapshot.paramMap;
    setTimeout(() => {
      this._modelService.selectedModel = paramMap.get('model');
      this._modelService.requestModelDefaults();
    }, 1);
  }

  ngOnDestroy() {
    this._modelService.reset();
  }

  get elementType(): string {
    return this._modelService.defaults.element_type;
  }

  get modelId(): string {
    return this._modelService.selectedModel;
  }

  get progress(): boolean {
    return this._modelService.progress;
  }

  get recordables(): string {
    return this._modelService.defaults.recordables || [];
  }

  get sidenavMode(): string {
    return this._modelService.sidenavMode;
  }

  hasModel(): boolean {
    return this._modelService.hasModel();
  }
}
