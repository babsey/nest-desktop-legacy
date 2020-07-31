import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { Model } from '../../../components/model/model';

import { ModelService } from '../../../services/model/model.service';


@Component({
  selector: 'app-model-params-slider',
  templateUrl: './model-params-slider.component.html',
  styleUrls: ['./model-params-slider.component.scss']
})
export class ModelParamsSliderComponent implements OnInit, OnChanges {
  @Input() model: any = {};
  public settings: Model;

  constructor(
    private _modelService: ModelService,
  ) { }

  ngOnInit() {
    this.settings = this._modelService.getSettings(this.model);
  }

  ngOnChanges() {
  }

  save(): void {
  }

}
