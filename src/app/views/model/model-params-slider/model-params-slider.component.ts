import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { Model } from '../../../components/model/model';

import { ModelService } from '../../../services/model/model.service';


@Component({
  selector: 'app-model-params-slider',
  templateUrl: './model-params-slider.component.html',
  styleUrls: ['./model-params-slider.component.scss']
})
export class ModelParamsSliderComponent implements OnInit, OnChanges {
  @Input() modelId: string = '';
  private model: Model;

  constructor(
    private _modelService: ModelService,
  ) { }

  ngOnInit() {
    this.model = this._modelService.getModel(this.modelId);
  }

  ngOnChanges() {
  }

  save(): void {
  }

}
