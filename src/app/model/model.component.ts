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

  constructor(
    private route: ActivatedRoute,
    public _modelService: ModelService,
  ) { }

  ngOnInit(): void {
    let paramMap = this.route.snapshot.paramMap;
    let model = paramMap.get('model');
    if (model) {
      this._modelService.selectModel(model);
    }
  }

  ngOnDestroy(): void {
    // this._modelService.selectedModel = '';
  }

}
