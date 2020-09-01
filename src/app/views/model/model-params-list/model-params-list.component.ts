import { Component, OnInit, Input } from '@angular/core';

import { listAnimation } from '../../../animations/list-animation';

import { ModelService } from '../../../services/model/model.service';


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
    public modelService: ModelService,
  ) {
  }

  ngOnInit() {
  }

  hasParam(paramId: string): boolean {
    if (this.modelService.hasModel(this.model)) {
      const settings: any = this.modelService.getSettings(this.model);
      return settings.params.filter(param => param.id == paramId).length > 0;
    }
    return false
  }

}
