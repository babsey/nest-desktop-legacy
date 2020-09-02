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
    public modelService: ModelService,
  ) { }

  ngOnInit() {
    let paramMap: any = this._route.snapshot.paramMap;
    this.modelService.selectedModel = paramMap.get('model');
  }

  ngOnDestroy() {
    // this._modelService.selectedModel = '';
  }

  get modelId(): string {
    return this.modelService.selectedModel;
  }

  get elementType(): string {
    return this.modelService.defaults.element_type;
  }

  get recordables(): string {
    return this.modelService.defaults.recordables || [];
  }
}
