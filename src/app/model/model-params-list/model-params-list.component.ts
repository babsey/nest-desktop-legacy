import { Component, OnInit, Input } from '@angular/core';

import { ModelService } from '../model.service';

import { listAnimation } from '../../animations/list-animation';


@Component({
  selector: 'app-model-params-list',
  templateUrl: './model-params-list.component.html',
  styleUrls: ['./model-params-list.component.scss'],
  animations: [
    listAnimation
  ]
})
export class ModelParamsListComponent implements OnInit {
  @Input() model: string = '';
  public objectKeys = Object.keys;

  constructor(
    public _modelService: ModelService,
  ) {
  }

  ngOnInit() {
  }

  hasParam(paramId: string): boolean {
    if (this._modelService.hasModel(this.model)) {
      const settings: any = this._modelService.getSettings(this.model);
      return settings.params.filter(param => param.id == paramId).length > 0;
    }
    return false
  }

}
